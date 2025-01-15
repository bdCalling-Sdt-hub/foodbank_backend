import { Request, Response } from "express";
import httpStatus from "http-status";
import CatchAsync from "../../../shared/CatchAsync";
import SendResponse from "../../../shared/SendResponse";
import { ITransportVolunteer } from "../TransportVolunteer/TransportVolunteer.interface";
import { DriverService } from "./drivers.service";

// ------------------Driver APIs endpoint------------------
// Get all driver
const GetAllDeriverController = CatchAsync(
  async (req: Request, res: Response) => {
    const result = await DriverService.GetAllDriverService();

    SendResponse<Partial<ITransportVolunteer[]>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Drivers get success",
      data: result,
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
