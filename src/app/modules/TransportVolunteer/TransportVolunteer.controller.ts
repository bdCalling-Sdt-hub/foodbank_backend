import { Request, Response } from "express";
import httpStatus from "http-status";
import CatchAsync from "../../../shared/CatchAsync";
import SendResponse from "../../../shared/SendResponse";
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
    const result =
      await TransportVolunteerService.GetAllTransportVolunteerService();

    SendResponse<ITransportVolunteer[] | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get all volunteer success!",
      data: result,
    });
  }
);

// Single get transport volunteer
const GetSingleTransportVolunteerController = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result =
      await TransportVolunteerService.GetSingleTransportVolunteerService(id);

    SendResponse<ITransportVolunteer | null>(res, {
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

export const TransportVolunteerController = {
  CreateTransportVolunteerController,
  GetAllTransportVolunteerController,
  GetSingleTransportVolunteerController,
  UpdateSingleTransportVolunteerController,
};
