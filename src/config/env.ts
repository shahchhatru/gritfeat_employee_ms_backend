import * as dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 5000,
  cors: process.env.CORS,
  mongoDbConnectionUrl: process.env.MONGO_URL,
  accessKeySecret: process.env.ACCESS_KEY || 'access',
  refreshKeySecret: process.env.REFRESH_KEY || 'refresh',
  email:process.env.EMAIL,
  emailpassword:process.env.EMAIL_PASSWORD,
  frontendurl:process.env.FRONTEND_URL,
  JWT_PASSWORD_KEY: process.env.JWT_PASSWORD_KEY || 'secret',
};
