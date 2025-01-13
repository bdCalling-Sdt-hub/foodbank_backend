import dotenv from 'dotenv';
import { Server } from 'http';
import mongoose from 'mongoose';
import { default as Config, default as Conifg } from '../config/Config';
import app from '../index';
dotenv.config();


let server: Server;
const databaseConnect = async () => {
  try {
    await mongoose.connect(Conifg.database_url as string);
    console.log('Database is connected!');

    server = app.listen(Config.port, () => {
      console.log(`Example app listening on port ${Config.port}`);
    });
  } catch (error) {
    console.error('Fail to DB connected!');
  }
};
// mongoose.set('strictPopulate', false);

process.on('unhandledRejection', error => {
  // errorLogger.log(error);
  if (server) {
    server.close(() => {
      console.error(error);
      process.exit(1);
    });
  } else {
    process.exit(2);
  }
});

process.on('SIGTERM', () => {
  console.info('SIGTERM is received!');
  if (server) {
    server.close();
  }
});

export default databaseConnect;
