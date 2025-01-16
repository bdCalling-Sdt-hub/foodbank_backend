import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constant/constant";
import CatchAsync from "../../../shared/CatchAsync";
import pick from "../../../shared/pick";
import SendResponse from "../../../shared/SendResponse";
import { ITransportVolunteer } from "../TransportVolunteer/TransportVolunteer.interface";
import { ClientService } from "./clients.service";

// ------------------CLIENT APIs endpoint------------------
// Get all client
const GetAllClientsController = CatchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, [
      "firstName",
      "lastName",
      "email",
      "holocaustSurvivor",
      "dateOfBirth",
      "address",
      "apartment",
      "city",
      "state",
      "zipCode",
      "dietaryRestrictions",
    ]);

    const paginationOptions = pick(req.query, paginationFields);

    const result = await ClientService
      .GetAllClientService
      // filters,
      // paginationOptions
      ();

    SendResponse<Partial<ITransportVolunteer[]>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Clients get success",
      data: result,
    });
  }
);

// Get single client
const GetSingleClientController = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await ClientService.GetSingleTransportClientService(id);

    SendResponse<Partial<ITransportVolunteer>>(res, {
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
    const { id } = req.params;
    const payload = req.body;

    const result = await ClientService.UpdateSingleClientService(id, payload);

    SendResponse<Partial<ITransportVolunteer>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Client updated success!",
      data: result,
    });
  }
);

export const ClientController = {
  GetAllClientsController,
  GetSingleClientController,
  UpdateSingleClientController,
};
