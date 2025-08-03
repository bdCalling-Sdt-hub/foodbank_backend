// /* eslint-disable @typescript-eslint/ban-ts-comment */
// import nodemailer, { Transporter } from 'nodemailer';
// import Config from '../config/Config';

// type IEmailOptions = {
//     email: string;
//     subject: string;
//     // template: string;
//     // data?: { [key: string]: any };
//     html: any;
// };

// const currentDate = new Date();
// const formattedDate = currentDate.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
// });

// const sendUserRequest = async (options: IEmailOptions): Promise<void> => {
//     const transporter: Transporter = nodemailer.createTransport({
//         host: Config.smtp_host,
//         port: parseInt(Config.smtp_port as string),
//         auth: {
//             user: Config.email,
//             pass: Config.appKey,
//         },
//     });

//     const { email, subject, html } = options;

//     const mailOptions = {
//         from: `${Config.smtp_name} <${Config.email}>`,
//         to: email,
//         date: formattedDate,
//         signed_by: 'bdCalling.com',
//         subject,
//         html,
//     };
//     await transporter.sendMail(mailOptions);
// };

// export default sendUserRequest;

// src/utils/sendUserRequest.ts
import nodemailer, { Transporter } from 'nodemailer';
import mailgun from 'nodemailer-mailgun-transport';
import Config from '../config/Config';

type IEmailOptions = {
    email: string;
    subject: string;
    html: string;
};

const sendUserRequest = async (options: IEmailOptions): Promise<void> => {
    const transporter: Transporter = nodemailer.createTransport(
        mailgun({
            auth: {
                // @ts-ignore
                api_key: Config.mailgunApiKey,
                domain: Config.mailgunDomain,
            },
        })
    );

    const { email, subject, html } = options;

    const mailOptions = {
        from: `${Config.smtp_name} <support@${Config.mailgunDomain}>`,
        to: email,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
};

export default sendUserRequest;
