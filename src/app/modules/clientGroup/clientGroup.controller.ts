import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constant/constant";
import CatchAsync from "../../../shared/CatchAsync";
import pick from "../../../shared/pick";
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
    const filters = pick(req.query, [
      "searchTerm",
      "volunteerGroupName",
      "volunteerType",
    ]);

    const paginationOptions = pick(req.query, paginationFields);

    const result = await ClientGroupService.GetAllClientGroupService(
      // @ts-ignore
      filters,
      paginationOptions
    );

    SendResponse<IClientGroup[] | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Client group get success!",
      meta: result.meta,
      data: result.data,
    });
  }
);

// get single client group
const GetSingleClientGroupController = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await ClientGroupService.GetSingleClientGroupService(id);

    SendResponse<Partial<IClientGroup> | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Single group get success!",
      data: result,
    });
  }
);
// Update client group
const UpdateClientGroupController = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const result = await ClientGroupService.UpdateClientGroupService(
      id,
      payload
    );

    SendResponse<Partial<IClientGroup> | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Client group updated success!",
      data: result,
    });
  }
);

export const ClientController = {
  CreateClientGroupController,
  GetAllClientGroupController,
  UpdateClientGroupController,
  GetSingleClientGroupController,
};
