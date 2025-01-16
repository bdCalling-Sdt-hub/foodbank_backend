import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constant/constant";
import CatchAsync from "../../../shared/CatchAsync";
import pick from "../../../shared/pick";
import SendResponse from "../../../shared/SendResponse";
import { KeyOfFilterForFiltersKey } from "../clients/clients.constant";
import { ITransportVolunteer } from "../TransportVolunteer/TransportVolunteer.interface";
import { DriverService } from "./drivers.service";

// ------------------Driver APIs endpoint------------------
// Get all driver
const GetAllDeriverController = CatchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, KeyOfFilterForFiltersKey);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await DriverService.GetAllDriverService(
      // @ts-ignore
      filters,
      paginationOptions
    );

    SendResponse<Partial<ITransportVolunteer[]>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Drivers get success",
      meta: result.meta,
      data: result.data,
    });
  }
);

//Single get driver
const GetSingleDriverController = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DriverService.GetSingleDriverService(id);

    SendResponse<Partial<ITransportVolunteer>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Single drivers get success!",
      data: result,
    });
  }
);

//update driver
const UpdateSingleDriverController = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await DriverService.UpdateSingleDriverService(id, payload);

    SendResponse<Partial<ITransportVolunteer>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Driver updated success!",
      data: result,
    });
  }
);

export const DriverController = {
  GetAllDeriverController,
  GetSingleDriverController,
  UpdateSingleDriverController,
};
