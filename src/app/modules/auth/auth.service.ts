import httpStatus from "http-status";

import bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import Config from "../../../config/Config";
import ApiError from "../../../error/APIsError";
import { jwtTokenProvider } from "../../../helper/JTWProvider";
import { MailSend } from "../../../mail/mailSend";
import {
  IChangePassword,
  IForgot,
  IOTP,
  IResetPassword,
} from "../../../types/common";
import { generateOTP } from "../../../utils/OTP";
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

  // const update = await UserTable.updateOne({ email }, {
  //   email: "tayebrayhan101@gmail.com"
  // })

  // console.log("update", update)

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
    throw new ApiError(httpStatus.UNAUTHORIZED, "Old password is incorrect");
  }

  // Hash the new password
  // const hashedNewPassword = await bcrypt.hash(
  //   newPassword,
  //   Number(Config.password_sold_round)
  // );

  user.password = newPassword;
  await user.save();

  console.log("User saved", user);

  return { message: "Password changed successfully" };
};


// forgot password
const forgotPasswordService = async (payload: IForgot) => {
  const { email } = payload;

  // Find user in the database
  const existUser = await UserTable.findOne({ email });
  if (!existUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if OTP is already generated and expired
  const currentTime = new Date().getTime();
  // if (existUser.resetOTP && currentTime < existUser.otpExpiry!) {
  //   throw new ApiError(
  //     httpStatus.BAD_REQUEST,
  //     "OTP already sent and is valid. Please check your email."
  //   );
  // }

  // Generate a new OTP since either no OTP exists or OTP has expired
  const otp = generateOTP();
  const otpExpiry = currentTime + 5 * 60 * 1000; // 5 minutes expiry time

  // Update the user with the new OTP and expiry time
  await UserTable.updateOne(
    { email },
    {
      resetOTP: otp,
      otpExpiry: otpExpiry,
    }
  );

  const mailData = {
    otp,
    ...existUser.toObject(),
  };

  // Send OTP email
  MailSend(mailData);

  return { message: "OTP has been sent to your email." };
};

// reset password
const resetPasswordService = async (payload: IResetPassword) => {
  const { email, resetPassword } = payload;

  // Find the user from the database
  // Step 1: Verify OTP
  const existUser = await UserTable.findOne({ email });
  if (!existUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const otp = existUser.resetOTP;

  // Step 2: Verify OTP
  if (existUser.resetOTP !== otp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  // Step 3: Check if OTP has expired (5 minutes expiry)
  const currentTime = new Date().getTime();
  if (currentTime > existUser.otpExpiry!) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP has expired");
  }

  // Step 2: Update password
  // Check if resetPassword is provided
  if (!resetPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Password is required for the reset."
    );
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(
    resetPassword!,
    Number(Config.password_sold_round)
  );

  // Update the user's password
  await UserTable.updateOne({ email }, { password: hashedPassword });

  // Optionally, clear the OTP after successful reset
  await UserTable.updateOne(
    { email },
    { resetOTP: null, otpExpiry: null, isCheckOTP: null }
  );

  return { message: "Password reset successfully." };
};

// resend OTP
const resendOTPService = async (payload: IForgot) => {
  const { email } = payload;

  // Find user in the database
  const existUser = await UserTable.findOne({ email });
  if (!existUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if OTP is already generated and expired
  const currentTime = new Date().getTime();
  if (existUser.resetOTP && currentTime < existUser.otpExpiry!) {
    return { message: "OTP is still valid. Please check your email." };
  }

  // Generate a new OTP since either no OTP exists or OTP has expired
  const otp = generateOTP();
  const otpExpiry = currentTime + 5 * 60 * 1000; // 5 minutes expiry time

  // Update the user with the new OTP and expiry time
  await UserTable.updateOne(
    { email },
    {
      resetOTP: otp,
      otpExpiry: otpExpiry,
    }
  );

  const mailData = {
    otp,
    ...existUser.toObject(),
  };

  // Send OTP email
  MailSend(mailData);

  return { message: "A new OTP has been sent to your email." };
};

// Check the OTP
const CheckOTPService = async (payload: IOTP) => {
  const { email, otp } = payload;

  // Step 1: Check if user exists
  const existUser = await UserTable.findOne({ email });
  if (!existUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Step 2: Verify OTP
  if (existUser.resetOTP !== otp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  // Step 3: Check if OTP has expired (5 minutes expiry)
  const currentTime = new Date().getTime();
  if (currentTime > existUser.otpExpiry!) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP has expired");
  }

  existUser.resetOTP = otp;
  // console.log(existUser.isCheckOTP);
  return { message: "OTP is valid and verified" };
};

export const authService = {
  loginUserService,
  refreshTokenService,
  ChangePasswordService,
  forgotPasswordService,
  resetPasswordService,
  resendOTPService,
  CheckOTPService,
};
