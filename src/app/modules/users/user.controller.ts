import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constant/constant";
import CatchAsync from "../../../shared/CatchAsync";
import pick from "../../../shared/pick";
import SendResponse from "../../../shared/SendResponse";
import { UserFilterableKey } from "./user.constant";
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
  const filters = pick(req.query, UserFilterableKey);

  const paginationOptions = pick(req.query, paginationFields);

  const result = await UserService.GetAllUserService(
    // @ts-ignore
    filters,
    paginationOptions
  );

  SendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User get success!",
    meta: result.meta,
    data: result.data,
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
