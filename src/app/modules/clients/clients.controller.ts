import { Request, Response } from "express";
import httpStatus from "http-status";
import CatchAsync from "../../../shared/CatchAsync";
import SendResponse from "../../../shared/SendResponse";
import { IClient } from "./clients.interface";
import { ClientService } from "./clients.service";

// Create/Add client
const CreateClientController = CatchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await ClientService.CreateClientService(payload);

    SendResponse<IClient>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Client added success",
      data: result,
    });
  }
);

// Get all client
const GetAllClientController = CatchAsync(
  async (req: Request, res: Response) => {
    const result = await ClientService.GetAllClientService();

    SendResponse<IClient[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Client get success",
      data: result,
    });
  }
);

// Get single client
const GetSingleClientController = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ClientService.GetSingleClientService(id);

    SendResponse<IClient | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Single client get success",
      data: result,
    });
  }
);
// update single client
const UpdateSingleClientController = CatchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const { id } = req.params;
    const result = await ClientService.UpdateSingleClientService(id, payload);

    SendResponse<Partial<IClient> | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Single client update success",
      data: result,
    });
  }
);

export const ClientController = {
  CreateClientController,
  GetAllClientController,
  GetSingleClientController,
  UpdateSingleClientController,
};
