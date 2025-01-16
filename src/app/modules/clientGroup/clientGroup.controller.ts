import { Request, Response } from "express";
import httpStatus from "http-status";
import CatchAsync from "../../../shared/CatchAsync";
import SendResponse from "../../../shared/SendResponse";
import { IClientGroup } from "./clientGroup.interface";
import { ClientGroupService } from "./clientGroup.service";

// create a new client group
const CreateClientGroupController = CatchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await ClientGroupService.CreateClientGroupService(payload);

    SendResponse<IClientGroup | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Client group add success!",
      data: result,
    });
  }
);

// get all client group
const GetAllClientGroupController = CatchAsync(
  async (req: Request, res: Response) => {
    const result = await ClientGroupService.GetAllClientGroupService();

    SendResponse<IClientGroup[] | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Client group get success!",
      data: result,
    });
  }
);

export const ClientController = {
  CreateClientGroupController,
  GetAllClientGroupController,
};
