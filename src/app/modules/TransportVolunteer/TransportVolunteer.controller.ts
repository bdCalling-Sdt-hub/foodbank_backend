import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constant/constant";
import CatchAsync from "../../../shared/CatchAsync";
import pick from "../../../shared/pick";
import SendResponse from "../../../shared/SendResponse";
import { paginationFilterableKey } from "./TransportVolunteer.constant";
import { ITransportVolunteer } from "./TransportVolunteer.interface";
import { TransportVolunteerService } from "./TransportVolunteer.service";

// create a new transport volunteer
const CreateTransportVolunteerController = CatchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;

    const result =
      await TransportVolunteerService.CreateTransportVolunteerService(payload);

    SendResponse<ITransportVolunteer | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Volunteer add success!",
      data: result,
    });
  }
);

// get all transport volunteer
const GetAllTransportVolunteerController = CatchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, paginationFilterableKey);

    const paginationOptions = pick(req.query, paginationFields);

    const result =
      await TransportVolunteerService.GetAllTransportVolunteerService(
        // @ts-ignore
        filters,
        paginationOptions
      );

    SendResponse<ITransportVolunteer[] | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get all volunteer success!",
      meta: result.meta,
      data: result.data,
    });
  }
);

// Single get transport volunteer
const GetSingleTransportVolunteerController = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result =
      await TransportVolunteerService.GetSingleTransportVolunteerService(id);

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Single volunteer get success!",
      data: result,
    });
  }
);

// Update single transport volunteer
const UpdateSingleTransportVolunteerController = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const result =
      await TransportVolunteerService.UpdateSingleTransportVolunteerService(
        id,
        payload
      );

    SendResponse<Partial<ITransportVolunteer> | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Updated single volunteer!",
      data: result,
    });
  }
);

// Update single transport volunteer
const DeleteSingleTransportVolunteerController = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const result =
      await TransportVolunteerService.DeleteSingleTransportVolunteerService(id);

    SendResponse<Partial<ITransportVolunteer> | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Deleted single volunteer!",
      data: result,
    });
  }
);
//Get all driver and warehouse
const GetAllDriverWarehouseTransportVolunteerController = CatchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, paginationFilterableKey);

    const paginationOptions = pick(req.query, paginationFields);

    const result =
      await TransportVolunteerService.GetAllDriverWarehouseTransportVolunteerService(
        filters,
        paginationOptions
      );

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Driver & warehouse get success!",
      // @ts-ignore
      data: result,
    });
  }
);

export const TransportVolunteerController = {
  CreateTransportVolunteerController,
  GetAllTransportVolunteerController,
  GetSingleTransportVolunteerController,
  UpdateSingleTransportVolunteerController,
  DeleteSingleTransportVolunteerController,
  GetAllDriverWarehouseTransportVolunteerController,
};
