import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constant/constant";
import CatchAsync from "../../../shared/CatchAsync";
import pick from "../../../shared/pick";
import SendResponse from "../../../shared/SendResponse";
import { IGroups } from "../groups/groups.interface";
import { ClientGroupService } from "./clientGroup.service";

// create a new client group
const CreateClientGroupController = CatchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await ClientGroupService.CreateClientGroupService(payload);

    SendResponse<IGroups | null>(res, {
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
    const types = req.query.types;
    const result = await ClientGroupService.GetAllClientGroupService(
      // @ts-ignore
      filters,
      paginationOptions,
      types
    );

    SendResponse<IGroups[] | null>(res, {
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

    SendResponse<Partial<IGroups> | null>(res, {
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

    SendResponse<Partial<IGroups> | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Client group updated success!",
      data: result,
    });
  }
);
// delete client group
const DeleteSingleClientGroupController = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await ClientGroupService.DeleteClientGroupService(id);

    SendResponse<Partial<IGroups> | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Client group deleted success!",
      data: result,
    });
  }
);
// get all client group
const DriverClientGroupController = CatchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, [
      "searchTerm",
      "volunteerGroupName",
      "volunteerType",
    ]);

    const paginationOptions = pick(req.query, paginationFields);
    const types = req.query.types;
    const result = await ClientGroupService.DriverClientGroupService(
      // @ts-ignore
      filters,
      paginationOptions,
      types
    );

    SendResponse<IGroups[] | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Client group get success!",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const ClientController = {
  CreateClientGroupController,
  GetAllClientGroupController,
  UpdateClientGroupController,
  GetSingleClientGroupController,
  DeleteSingleClientGroupController,
  DriverClientGroupController,
};
