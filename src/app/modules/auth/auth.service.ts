import httpStatus from "http-status";

import bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import Config from "../../../config/Config";
import ApiError from "../../../error/APIsError";
import { jwtTokenProvider } from "../../../helper/JTWProvider";
import { MailSend } from "../../../mail/mailSend";
import { IChangePassword } from "../../../types/common";
import { UserTable } from "../users/user.model";
import {
  IAuthLoginTypes,
  IRefreshToken,
  IUserLoginResponse,
} from "./auth.interface";

// Login the user
const loginUserService = async (
  payload: IAuthLoginTypes
): Promise<IUserLoginResponse> => {
  const { email, password } = payload;

  const user = new UserTable();
  const isEmailExist = await user.isEmailExist(email);

  // Check the user
  if (!isEmailExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  // Check the password
  if (isEmailExist.password) {
    const passwordMatch = await user.isPasswordMatch(
      password,
      isEmailExist.password
    );

    if (!passwordMatch) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Your password does not match."
      );
    }
  }

  // Generate accessToken
  const accessToken = jwtTokenProvider.createToken(
    {
      email: isEmailExist?.email,
      role: isEmailExist?.role,
    },
    Config.access_key as Secret,
    Config.access_key_expire_in as string
  );

  // Refresh token
  const refreshToken = jwtTokenProvider.createToken(
    { email: isEmailExist?.email, role: isEmailExist?.role },
    Config.refresh_key as Secret,
    Config.fefresh_key_expire_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

// refresh token generating
const refreshTokenService = async (token: string): Promise<IRefreshToken> => {
  let verifyToken = null;
  try {
    verifyToken = jwtTokenProvider.verifyJwtToken(
      token,
      Config.refresh_key as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token.");
  }

  const { email: email } = verifyToken;

  const user = new UserTable();
  const isIdExist = await user.isEmailExist(email);

  if (!isIdExist?.email) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  // generate a new token
  const newAccessToken = jwtTokenProvider.createToken(
    {
      email: isIdExist.email,
      role: isIdExist.role,
    },
    Config.access_key as Secret,
    Config.access_key_expire_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

// password change
const ChangePasswordService = async (payload: IChangePassword) => {
  const { id, oldPassword, newPassword } = payload;

  // Find the user by id
  const user = await UserTable.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  // Verify the old password
  const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordMatch) {
    throw new ApiError(httpStatus.NOT_FOUND, "Old password is incorrect");
  }

  // Hash the new password
  const hashedNewPassword = await bcrypt.hash(
    newPassword,
    Number(Config.password_sold_round)
  );

  // Save the password
  user.password = hashedNewPassword;
  await user.save();
};

type IForgot = {
  id: string;
  email: string;
};

// forgot password
const forgotPasswordService = async (payload: IForgot) => {
  const { email } = payload;
  // console.log(email);
  // Find the user by id
  const user = await UserTable.findOne(
    { email },
    { role: 1, _id: 1, email: 1 }
  );

  if (!user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User with this email does not exist!"
    );
  }

  // console.log(user);

  // Create a password reset token
  const resetTokenPassword = jwtTokenProvider.resetToken(
    { id: user?._id },
    Config.refresh_key as Secret,
    "5m" as string
  );

  // console.log(resetTokenPassword);

  const resetLink = `${Config.frontendUrl}?token=${resetTokenPassword}`;

  // send mail in user
  MailSend(user, resetLink);

  return {
    resetLink,
    user,
  };
};

// reset password
const resetPasswordService = async (payload: any, token: string) => {
  const { email, resetPassword } = payload;
  // console.log(email);
  // Find the user by id
  const user = await UserTable.findOne(
    { email },
    { role: 1, _id: 1, email: 1 }
  );

  if (!user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User with this email does not exist!"
    );
  }

  // verify token
  const isValidToken = jwtTokenProvider.verifyJwtToken(
    token,
    Config.refresh_key as Secret
  );

  // hash password
  const password = await bcrypt.hash(
    resetPassword,
    Number(Config.password_sold_round)
  );

  // update password
  await UserTable.updateOne({ email }, { password });

  console.log(password);
  console.log(isValidToken);
};

export const authService = {
  loginUserService,
  refreshTokenService,
  ChangePasswordService,
  forgotPasswordService,
  resetPasswordService,
};
