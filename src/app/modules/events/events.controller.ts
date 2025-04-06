import { Request, Response } from "express";
import httpStatus from "http-status";
import CatchAsync from "../../../shared/CatchAsync";
import SendResponse from "../../../shared/SendResponse";
import { EventService } from "./events.service";
import { TransportVolunteerTable } from "../TransportVolunteer/TransportVolunteer.model";
import ApiError from "../../../error/APIsError";

const createEventsDb = CatchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await EventService.createEvent(payload);
  SendResponse<IEvents | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event add successfully!",
    data: result,
  });
});
const getEvent = CatchAsync(async (req: Request, res: Response) => {
  const result = await EventService.getEvent(req as Request);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event get successfully!",
    data: result,
  });
});

const getEvents = CatchAsync(async (req: Request, res: Response) => {
  const result = await EventService.getEvents(req as Request);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event get successfully!",
    data: result,
  });
});

const updateEvent = CatchAsync(async (req: Request, res: Response) => {
  const result = await EventService.updateEvent(req as Request);
  SendResponse<IEvents | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event get successfully!",
    data: result,
  });
});

const deleteEvent = CatchAsync(async (req: Request, res: Response) => {
  const result = await EventService.deleteEvent(req as Request);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event get successfully!",
    data: result,
  });
});

const addClients = CatchAsync(async (req: Request, res: Response) => {
  const result = await EventService.addClients(req as Request);

  return SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Client added successfully!",
    data: result,
  });
});

const removeClientByEmail = CatchAsync(async (req: Request, res: Response) => {
  const result = await EventService.removeClientByEmail(req as Request);

  return SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Removed successfully!",
    data: result,
  });
});

const addGroupUpdate = CatchAsync(async (req: Request, res: Response) => {
  const result = await EventService.addGroupUpdate(req.body as IGroupRequest);

  return SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Added successfully!",
    data: result,
  });
});

const removeGroupUpdate = CatchAsync(async (req: Request, res: Response) => {
  const result = await EventService.removeGroupUpdate(
    req.body as IGroupRequest
  );
  return SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Removed successfully!",
    data: result,
  });
});

const getEventsGroups = CatchAsync(async (req: Request, res: Response) => {
  const query: IGetGroups = {
    eventId: req.query.eventId as string,
    page: parseInt(req.query.page as string, 10) || 1,
    limit: parseInt(req.query.limit as string, 10) || 10,
    searchQuery: (req.query.searchQuery as string) || "",
    type: req.query.type as string,
  };

  const result = await EventService.getEventsGroups(query);
  return SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Removed successfully!",
    data: result,
  });
});

const getEventDrivers = CatchAsync(async (req: Request, res: Response) => {
  const result = await EventService.getEventDrivers(req as any);
  return SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "get successfully!",
    data: result,
  });
});

const acceptRequest = CatchAsync(async (req: Request, res: Response) => {
  const result = await EventService.acceptRequest(req as any);
  return SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Request accepted successfully!",
    data: result,
  });
});

const cancelRequest = CatchAsync(async (req: Request, res: Response) => {
  const result = await EventService.cancelRequest(req as any);
  return SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Request canaled successfully!",
    data: result,
  });
});

const assignedClients = CatchAsync(async (req: Request, res: Response) => {
  const result = await EventService.assignedClients(req as any);
  return SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Client assigned successfully!",
    data: result,
  });
});

const volunteerDetails = CatchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  console.log(id);
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "ID is required");
  }
  const result = await TransportVolunteerTable.findById(id)
  return SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "get successfully!",
    data: result,
  });
});

const confirmedClientsStatusUpdate = CatchAsync(async (req: Request, res: Response) => {
  const result = await EventService.confirmedClientsStatusUpdate(req as any);
  return SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Confirmed Clients Status Update Successfully!",
    data: result,
  });
});

// const getEventClients = CatchAsync(async (req: Request, res: Response) => {
//   const result = await EventService.getEventClients(req as any);
//   return SendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "get successfully!",
//     data: result,
//   });
// });



export const EventController = {
  createEventsDb,
  getEvent,
  getEvents,
  deleteEvent,
  updateEvent,
  addClients,
  removeClientByEmail,
  addGroupUpdate,
  removeGroupUpdate,
  getEventsGroups,
  getEventDrivers,
  acceptRequest,
  cancelRequest,
  assignedClients,
  volunteerDetails,
  confirmedClientsStatusUpdate,
  // getEventClients
};
