import httpStatus from "http-status";
import ApiError from "../../../error/APIsError";
import { IUser } from "./user.interface";
import { UserTable } from "./user.model";

const CreateUserService = async (payload: IUser): Promise<IUser | null> => {
  // Check if the contact number or email already exists
  const isCheckNumber = await UserTable.findOne({
    contactNo: payload.contactNo,
  });
  const isCheckEmail = await UserTable.findOne({ email: payload.email });

  // Throw an error if the contact number already exists
  if (isCheckNumber) {
    throw new ApiError(httpStatus.FORBIDDEN, "Contact number already exists!");
  }

  // Throw an error if the email already exists
  if (isCheckEmail) {
    throw new ApiError(httpStatus.FORBIDDEN, "Email already exists!");
  }

  // role set
  if (!payload.role) {
    payload.role = "admin";
  }

  // user status
  payload.status = true;

  // Create a new user in the database
  const result = await UserTable.create(payload);

  return result;
};

export const UserService = {
  CreateUserService,
};
