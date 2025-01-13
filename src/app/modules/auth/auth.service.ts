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
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
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

type IReset = {
  id: string;
  email: string;
};

// reset password
const ResetPasswordService = async (payload: IReset) => {
  const { email } = payload;
  // Find the user by id
  const user = await UserTable.findOne({ email });

  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User with this email does not exist!"
    );
  }

  // Create a password reset token

  const resetToken = jwtTokenProvider.createToken(
    { id: user?._id },
    Config.refresh_key as Secret,
    Config.fefresh_key_expire_in as string
  );

  const resetLink = `${Config.frontendUrl}/reset-password?token=${resetToken}`;

  // send mail in user
  MailSend(user, resetLink);
};

export const authService = {
  loginUserService,
  refreshTokenService,
  ChangePasswordService,
  ResetPasswordService,
};
