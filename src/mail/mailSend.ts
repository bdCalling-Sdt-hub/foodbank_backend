import nodemailer from "nodemailer";
import Config from "../config/Config";
import { MailBody } from "./mailBody";

const subject: string = "Reset Your OTP";

export const MailSend = async (payload: any) => {
  const user = payload.email;
  // console.log("email from mail send file", link);
  // console.log(payload);
  // console.log(payload.email);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: Config.email,
      pass: Config.appKey,
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: Config.email,
    to: user,
    subject: subject,
    // text: `Your OTP for password reset is: ${payload?.otp}`,
    html: MailBody(payload),
  });
};
