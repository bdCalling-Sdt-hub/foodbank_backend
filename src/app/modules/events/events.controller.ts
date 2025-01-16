import { Request, Response } from "express";
import httpStatus from "http-status";
import CatchAsync from "../../../shared/CatchAsync";
import SendResponse from "../../../shared/SendResponse";
import { EventService } from "./events.service";


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
  const result = await EventService.getEvents();
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




export const EventController = {
  createEventsDb,
  getEvent,
  getEvents,
  deleteEvent,
  updateEvent,
  addClients,
  removeClientByEmail
};
