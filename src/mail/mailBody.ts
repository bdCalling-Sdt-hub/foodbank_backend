import { IUser } from "../app/modules/users/user.interface";

export const MailBody = (payload: Partial<IUser>, link: string) => {
  const body = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; padding-bottom: 20px;">
                <h2 style="color: #333333;">Password Reset Request</h2>
            </div>
            <p style="color: #666666; font-size: 16px; line-height: 1.5;">
                Hello ${payload.firstName ? payload.firstName : "User"},
            </p>
            <p style="color: #666666; font-size: 16px; line-height: 1.5;">
                We received a request to reset your password. Please click the button below to set a new password:
            </p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${link}" style="
                    display: inline-block;
                    background-color: #4caf50;
                    color: white;
                    padding: 14px 20px;
                    font-size: 16px;
                    text-decoration: none;
                    border-radius: 5px;
                ">Reset Password</a>
            </div>
           
            <div style="text-align: center; padding-top: 20px; font-size: 14px; color: #999999;">
                <p>Thank you for using our service!</p>
                <p>Best Regards,</p>
                <p>Our Company</p>
                <p>
                    <a href="https://yourcompanywebsite.com" style="color: #4caf50; text-decoration: none;">Visit our website</a>
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

  return body;
};
