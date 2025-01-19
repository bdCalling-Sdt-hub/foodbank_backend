import { Request, Response } from "express";
import httpStatus from "http-status";
import Config from "../../../config/Config";
import CatchAsync from "../../../shared/CatchAsync";
import SendResponse from "../../../shared/SendResponse";
import { IUserLoginResponse } from "./auth.interface";
import { authService } from "./auth.service";

// login user
const loginUser = CatchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;

  const result = await authService.loginUserService(loginData);
  const { refreshToken, ...others } = result;

  const cookieOptions = {
    secure: Config.env === "production",
    httpOnly: true,
  };
  res.cookie("refreshToken", refreshToken, cookieOptions);

  // if ('refreshToken' in result) {
  //   delete result.refreshToken;
  // }

  SendResponse<IUserLoginResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successfully!",
    data: others,
  });
});

// refresh token
const refreshToken = CatchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  // console.log(refreshToken);

  const result = await authService.refreshTokenService(refreshToken);

  const cookieOptions = {
    secure: Config.env === "production",
    httpOnly: true,
  };
  res.cookie("refreshToken", refreshToken, cookieOptions);

  // if ('refreshToken' in result) {
  //   delete result.refreshToken;
  // }

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successfully!",
    data: result,
  });
});

// change password
const changePassword = CatchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await authService.ChangePasswordService(payload);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password change success!",
    data: result,
  });
});

// forgot password
const forgotPassword = CatchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.forgotPasswordService(payload);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Please check your mail.",
    data: result,
  });
});

// reset password
const resetPassword = CatchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  // @ts-ignore
  const result = await authService.resetPasswordService(payload);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password updated!",
    data: result,
  });
});

// Resend OTP
const resendOTPController = CatchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  // @ts-ignore
  const result = await authService.resendOTPService(payload);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: null,
    data: result,
  });
});

// Check OTP
const checkOTPController = CatchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  // @ts-ignore
  const result = await authService.CheckOTPService(payload);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: null,
    data: result,
  });
});

export const loginController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  resendOTPController,
  checkOTPController,
};
