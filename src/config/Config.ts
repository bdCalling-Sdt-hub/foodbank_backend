import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT || 1000,
  base_url: process.env.BASE_URL,
  database_url: process.env.URI,
  env: process.env.NODE_ENV,
  password_sold_round: process.env.PASSWORD_SOLD_ROUND,
  access_key: process.env.JWT_ACCESS_KEY,
  access_key_expire_in: process.env.JWT_ACCESS_KEY_EXPIRE_IN,
  refresh_key: process.env.JWT_REFRESH_KEY,
  fefresh_key_expire_in: process.env.JWT_REFRESH_KEY_EXPIRE_IN,

  email: process.env.EMAIL_USER,
  appKey: process.env.EMAIL_PASS,
  smtp_name: process.env.SMTP_NAME,
  smtp_service: process.env.SMTP_SERVICE,
  smtp_host: process.env.SMTP_HOST,
  smtp_port: process.env.SMTP_PORT,



  frontendUrl: process.env.FRONTEND_URL,
};
