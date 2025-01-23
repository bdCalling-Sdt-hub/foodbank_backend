import { Request } from "express";
import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import Config from "../../../config/Config";
import { ENUM_USER_ROLE } from "../../../enum/role";
import ApiError from "../../../error/APIsError";
import { jwtTokenProvider } from "../../../helper/JTWProvider";
import { paginationHelper } from "../../../helper/paginationHelper";
import { IGenResponse } from "../../interfaces/Common";
import { IUploadFile } from "../../interfaces/File";
import { IPaginationOptions } from "../../interfaces/interfaces";
import { KeyOfFilterForSearchTerms } from "./user.constant";
import { IUser, IUserFilters } from "./user.interface";
import { UserTable } from "./user.model";

// create user service
const CreateUserService = async (req: Request): Promise<IUser | null> => {
  const payload: IUser = req.body;
  // console.log(req.body.data);

  // Handle file upload (profile picture)
  const file = req.file as IUploadFile;

  const fileName = `${file?.destination}${file.filename}`;
  // console.log(fileName);

  if (file) {
    payload.profilePicture = fileName;
  }

  // Validate if contact number or email already exists
  const [isCheckNumber, isCheckEmail] = await Promise.all([
    UserTable.findOne({ contactNo: payload.contactNo }),
    UserTable.findOne({ email: payload.email }),
  ]);

  // Throw an error if the contact number already exists
  if (isCheckNumber) {
    throw new ApiError(httpStatus.FORBIDDEN, "Contact number already exists!");
  }

  // Throw an error if the email already exists
  if (isCheckEmail) {
    throw new ApiError(httpStatus.FORBIDDEN, "Email already exists!");
  }

  // Set default role if not provided
  if (!payload.role) {
    payload.role = "admin";
  }

  console.log(file);

  // Set user status
  payload.status = true;

  // Parse and modify the data object
  const data = JSON.parse(req.body.data);

  // Add profilePicture and role to the data object
  data.profilePicture = payload.profilePicture;
  data.role = payload.role;

  console.log(data);

  // Create the new user in the database
  const result = await UserTable.create({ ...payload, ...data });

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

// get single user service
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

const DeleteUserService = async (
  id: string
): Promise<Partial<IUser> | null> => {
  // Validate if id is provided
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required!");
  }

  const isSupperAdmin = await UserTable.findById(id);

  // If the user doesn't exist
  if (!isSupperAdmin) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not exist!");
  }

  // Check if the user is a super admin and prevent deletion
  if (isSupperAdmin.role === ENUM_USER_ROLE.SUPER_ADMIN) {
    throw new ApiError(httpStatus.FORBIDDEN, "Super admin cannot be deleted!");
  }

  // Find and delete the user
  const result = await UserTable.findByIdAndDelete(id);

  // Return the deleted user
  return result;
};

// get single user service
const SuperAdminUserService = async (req: Request): Promise<IUser | null> => {
  const token = req.headers.authorization;

  if (!token) {
    throw new ApiError(httpStatus.FORBIDDEN, "Token not provided!");
  }

  // Verify the token
  const decodedToken = jwtTokenProvider.verifyJwtToken(
    token,
    Config.access_key!
  );

  if (
    !decodedToken ||
    typeof decodedToken !== "object" ||
    !decodedToken.email
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token payload!");
  }

  const email = decodedToken.email;
  // Find user by email
  const user = await UserTable.findOne({ email: email });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist!");
  }

  return user;
};

export const UserService = {
  CreateUserService,
  GetAllUserService,
  GetSingleUserService,
  UpdateUserService,
  DeleteUserService,
  SuperAdminUserService,
};
