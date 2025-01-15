import { Request, Response } from "express";
import httpStatus from "http-status";
import CatchAsync from "../../../shared/CatchAsync";
import SendResponse from "../../../shared/SendResponse";
import { ITransportVolunteer } from "../TransportVolunteer/TransportVolunteer.interface";
import { WarehouseService } from "./warehouse.service";

// ------------------Warehouse APIs endpoint------------------
// Get all Warehouse
const GetAllWarehouseController = CatchAsync(
  async (req: Request, res: Response) => {
    const result = await WarehouseService.GetAllWarehouseService();

    SendResponse<Partial<ITransportVolunteer[]>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Warehouse get success",
      data: result,
    });
  }
);

//Single get Warehouse
const GetSingleWarehouseController = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await WarehouseService.GetSingleWarehouseService(id);

    SendResponse<Partial<ITransportVolunteer>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Single warehouse get success!",
      data: result,
    });
  }
);

//update Warehouse
const UpdateSingleWarehouseController = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await WarehouseService.UpdateSingleWarehouseService(
      id,
      payload
    );

    SendResponse<Partial<ITransportVolunteer>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Warehouse updated success!",
      data: result,
    });
  }
);

export const WarehouseController = {
  GetAllWarehouseController,
  GetSingleWarehouseController,
  UpdateSingleWarehouseController,
};
