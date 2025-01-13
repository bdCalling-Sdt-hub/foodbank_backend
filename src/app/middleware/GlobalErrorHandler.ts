import { ErrorRequestHandler } from "express";
import Config from "../../config/Config";
import ApiError from "../../error/APIsError";
import handleCastError from "../../error/HandleCastError";
import { handleValidationError } from "../../error/HandleValidationError";
import IGenericErrorMessage from "../interfaces/interfaces";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-unused-expressions
  Config.env === "development"
    ? console.log("Global error ~~", err)
    : console.error("Global error ~~", err);

  let statusCode = 500;
  let message = "Something is wrong!";
  let errorMessage: IGenericErrorMessage[] = [];

  if (err?.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessage;
  }
  //    else if (err instanceof ZodError) {
  //     const simplifiedError = handleZodError(err);
  //     statusCode = simplifiedError.statusCode;
  //     message = simplifiedError.message;
  //     errorMessage = simplifiedError.errorMessage;
  //   }
  else if (err?.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessage;
  } else if (err instanceof ApiError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorMessage = err?.message
      ? [
          {
            path: "",
            message: err.message,
          },
        ]
      : [];
  } else if (err instanceof Error) {
    message = err?.message;
    errorMessage = err?.message
      ? [
          {
            path: "",
            message: err.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    stack: Config.env !== "production" ? err?.stack : undefined,
  });

  next();
};

export default globalErrorHandler;
