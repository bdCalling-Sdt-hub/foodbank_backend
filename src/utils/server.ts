import dotenv from "dotenv";
import { Server } from "http";
import mongoose from "mongoose";
import { default as Config } from "../config/Config";
import app from "../index";
dotenv.config();

const URI =
  "mongodb+srv://rakibul_11:q7x2IazBrxuFhGjQ@masters.vgs9q.mongodb.net/food_bank?retryWrites=true&w=majority";

let server: Server;
const databaseConnect = async () => {
  try {
    await mongoose.connect(URI as string);
    console.log("Database is connected!");

    server = app.listen(Config.port, () => {
      console.log(`Example app listening on port ${Config.port}`);
    });
  } catch (error) {
    console.error("Fail to DB connected!");
  }
};
// mongoose.set('strictPopulate', false);

process.on("unhandledRejection", (error) => {
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

process.on("SIGTERM", () => {
  console.info("SIGTERM is received!");
  if (server) {
    server.close();
  }
});

export default databaseConnect;
