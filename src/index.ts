import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middleware/GlobalErrorHandler";
import router from "./app/routes/app.route";
import databaseConnect from "./utils/server";
const app: Application = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// APIs end point
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    message: "Welcome from our server!",
  });
});

app.use(globalErrorHandler);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not found.",
    errorMessage: [
      {
        path: req.originalUrl,
        message: "API not found!",
      },
    ],
  });
  next();
});

databaseConnect();

export default app;
