import { Request, Response } from "express";
import httpStatus from "http-status";
import CatchAsync from "../../../shared/CatchAsync";
import SendResponse from "../../../shared/SendResponse";
import { IUser } from "./user.interface";
import { UserService } from "./user.service";

// create a new user
const CreateUserController = CatchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await UserService.CreateUserService(payload);

  SendResponse<IUser | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User add success!",
    data: result,
  });
});

// get all user
const GetAllUserController = CatchAsync(async (req: Request, res: Response) => {
  const result = await UserService.GetAllUserService();

  SendResponse<IUser[] | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User get success!",
    data: result,
  });
});

// get single user
const GetSingleUserController = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserService.GetSingleUserService(id);

    SendResponse<IUser | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Single user get success!",
      data: result,
    });
  }
);

// update single user
const UpdateUserController = CatchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await UserService.UpdateUserService(id, payload);

  SendResponse<Partial<IUser> | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated success!",
    data: result,
  });
});

// update single user
const DeleteUserController = CatchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await UserService.DeleteUserService(id);

  SendResponse<Partial<IUser> | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted success!",
    data: result,
  });
});

export const UserController = {
  CreateUserController,
  GetAllUserController,
  GetSingleUserController,
  UpdateUserController,
  DeleteUserController,
};
