import { Request, Response } from "express";
import httpStatus from "http-status";
import CatchAsync from "../../../shared/CatchAsync";
import SendResponse from "../../../shared/SendResponse";
import { IUser } from "./user.interface";
import { UserService } from "./user.service";

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

export const UserController = {
  CreateUserController,
};
