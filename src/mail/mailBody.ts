import { IUser } from "../app/modules/users/user.interface";

export const MailBody = (payload: IUser, link: string) => {
  const body = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset</title>
        <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        h2 {
            color: #333333;
        }
        p {
            color: #666666;
            font-size: 16px;
            line-height: 1.5;
        }
        .reset-button {
            display: block;
            background-color: #4caf50;
            color: white;
            padding: 14px 20px;
            font-size: 16px;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            font-size: 14px;
            color: #999999;
        }
        .footer a {
            color: #4caf50;
            text-decoration: none;
        }
        .footer p {
            margin: 10px 0;
        }
        </style>
    </head>
    <body>
        <div class="container">
        <div class="header">
            <h2>Password Reset Request</h2>
        </div>
        <p>Hello ${payload.firstName ? payload.firstName : "N/A"},</p>
        <p>We received a request to reset your password. Please click the link below to choose a new password:</p>
        <a href="${link}" class="reset-button">Reset Password</a>
        <div class="footer">
            <p>Thank you for using our service!</p>
            <p>Best Regards,</p>
            <p>Our Company</p>
            <p>
            <a href="https://yourcompanywebsite.com">Visit our website</a>
            </p>
        </div>
        </div>
    </body>
    </html>
`;

  return body;
};
