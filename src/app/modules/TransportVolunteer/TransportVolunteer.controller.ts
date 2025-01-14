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

export const TransportVolunteerController = {
  CreateTransportVolunteerController,
};
