import mongoose from "mongoose";
import { IGenericErrorResponse } from "../app/interfaces/Common";
import IGenericErrorMessage from "../app/interfaces/interfaces";

export const handleValidationError = (
  err: mongoose.Error.ValidationError
): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = Object.values(err.errors).map(
    (ele: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: ele?.path,
        message: ele?.message,
      };
    }
  );

  const statusCode = 400;
  return {
    statusCode,
    message: "Validation errors",
    errorMessage: errors,
  };
};
