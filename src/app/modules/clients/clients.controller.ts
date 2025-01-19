import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constant/constant";
import CatchAsync from "../../../shared/CatchAsync";
import pick from "../../../shared/pick";
import SendResponse from "../../../shared/SendResponse";
import { ITransportVolunteer } from "../TransportVolunteer/TransportVolunteer.interface";
import { KeyOfFilterForFiltersKey } from "./clients.constant";
import { ClientService } from "./clients.service";

// ------------------CLIENT APIs endpoint------------------
// Get all client
const GetAllClientsController = CatchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, KeyOfFilterForFiltersKey);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await ClientService.GetAllClientService(
      // @ts-ignore
      filters,
      paginationOptions
    );

    SendResponse<Partial<ITransportVolunteer[]>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Clients get success",
      meta: result.meta,
      data: result.data,
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

// delete single client
const DeleteSingleClientController = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await ClientService.DeleteSingleClientService(id);

    SendResponse<Partial<ITransportVolunteer>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Client deleted success!",
      data: result,
    });
  }
);

export const ClientController = {
  GetAllClientsController,
  GetSingleClientController,
  UpdateSingleClientController,
  DeleteSingleClientController,
};
