import { Model } from "mongoose";

export type IUser = {
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  password: string;
  role: "super_admin" | "admin";
  profilePicture?: string;
  status?: boolean;
  resetOTP?: string;
  otpExpiry?: number;
  isCheckOTP?: string;
};

export type IUserMethods = {
  isEmailExist(email: string): Promise<Partial<IUser> | null>;
  isPasswordMatch(
    currentPassword: string,
    savePassword: string
  ): Promise<boolean>;
};

// filter user
export type IUserFilters = {
  searchTerm?: string;
  firstName: string;
  lastName: string;
  id: string;
  email: string;
  contactNo: string;
  role: string;
  _id: string;
};

export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;
