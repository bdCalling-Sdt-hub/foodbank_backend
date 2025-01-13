import nodemailer from "nodemailer";
import { IUser } from "../app/modules/users/user.interface";
import Config from "../config/Config";
import { MailBody } from "./mailBody";

const subject: string = "Reset Your Password";

export const MailSend = async (payload: IUser, link: string) => {
  const user = payload.email;
  // console.log("email from mail send file", user);

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
    text: "Dear user",
    html: MailBody(payload, link),
  });
};
