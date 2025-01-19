import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constant/constant";
import CatchAsync from "../../../shared/CatchAsync";
import pick from "../../../shared/pick";
import SendResponse from "../../../shared/SendResponse";
import { KeyOfFilterForFiltersKey } from "../clients/clients.constant";
import { ITransportVolunteer } from "../TransportVolunteer/TransportVolunteer.interface";
import { WarehouseService } from "./warehouse.service";

// ------------------Warehouse APIs endpoint------------------
// Get all Warehouse
const GetAllWarehouseController = CatchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, KeyOfFilterForFiltersKey);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await WarehouseService.GetAllWarehouseService(
      // @ts-ignore
      filters,
      paginationOptions
    );

    SendResponse<Partial<ITransportVolunteer[]>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Warehouse get success",
      meta: result.meta,
      data: result.data,
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
//delete Warehouse
const DeleteSingleWarehouseController = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await WarehouseService.DeleteSingleWarehouseService(id);

    SendResponse<Partial<ITransportVolunteer>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Warehouse deleted success!",
      data: result,
    });
  }
);

export const WarehouseController = {
  GetAllWarehouseController,
  GetSingleWarehouseController,
  UpdateSingleWarehouseController,
  DeleteSingleWarehouseController,
};
