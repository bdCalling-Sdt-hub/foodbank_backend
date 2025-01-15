import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import ApiError from "../../../error/APIsError";
import { paginationHelper } from "../../../helper/paginationHelper";
import { IGenResponse } from "../../interfaces/Common";
import { IPaginationOptions } from "../../interfaces/interfaces";
import { KeyOfFilterForSearchTerms } from "./user.constant";
import { IUser, IUserFilters } from "./user.interface";
import { UserTable } from "./user.model";

// create user service
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

// get all user service
const GetAllUserService = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenResponse<IUser[]>> => {
  const { searchTerm, ...searchTermData } = filters;

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: KeyOfFilterForSearchTerms.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(searchTermData).length) {
    andConditions.push({
      $and: Object.entries(searchTermData).map(([fields, value]) => ({
        [fields]: value,
      })),
    });
  }

  // pagination sort
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.paginationCalculation(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions = andConditions.length ? { $and: andConditions } : {};
  const result = await UserTable.find(whereConditions)

    .sort(sortConditions)
    .limit(limit)
    .skip(skip);

  const total = await UserTable.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get all user service
const GetSingleUserService = async (id: string): Promise<IUser | null> => {
  const user = await UserTable.findById(id);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist!");
  }
  return user;
};

// Update user service
const UpdateUserService = async (
  id: string,
  payload: Partial<IUser>
): Promise<Partial<IUser> | null> => {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required!");
  }

  // Update the user and return the updated document
  const updatedUser = await UserTable.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist!");
  }

  return updatedUser;
};

// delete user service
const DeleteUserService = async (
  id: string
): Promise<Partial<IUser> | null> => {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required!");
  }

  const result = await UserTable.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not exits!");
  }

  return result;
};

export const UserService = {
  CreateUserService,
  GetAllUserService,
  GetSingleUserService,
  UpdateUserService,
  DeleteUserService,
};
