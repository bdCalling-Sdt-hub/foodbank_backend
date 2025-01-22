import { Request } from "express";
import httpStatus from "http-status";
import Config from "../../../config/Config";
import ApiError from "../../../error/APIsError";
import sendUserRequest from "../../../mail/sendUserRequest";
import { sendUserRequestBody } from "../../../mail/sendUserRequestBody";
import { TransportVolunteerTable } from "../TransportVolunteer/TransportVolunteer.model";
import Events from "./events.model";

const createEvent = async (payload: IEvents): Promise<IEvents | null> => {
  console.log("console from service page", payload);

  try {
    const result = await Events.create(payload);
    return result;
  } catch (error) {
    console.error("Error creating event:", error);
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create event");
  }
};

const getEvent = async (req: Request) => {
  const { eventId } = req.params;

  try {
    const event = await Events.findById(eventId)
      .populate("client.userId")
      .populate({
        path: "groups",
        populate: {
          path: "gid",
          model: "ClientGroups",
        },
      });

    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
    }

    let holocaustSurvivorsCount = 0;
    let nonHolocaustSurvivorsCount = 0;

    for (const clientObj of event.client) {
      const client = await TransportVolunteerTable.findById(clientObj.userId);
      if (client) {
        if (client.holocaustSurvivor === "true") {
          holocaustSurvivorsCount++;
        } else {
          nonHolocaustSurvivorsCount++;
        }
      }
    }

    const totalClients = holocaustSurvivorsCount + nonHolocaustSurvivorsCount;

    return {
      event,
      holocaustSurvivors: holocaustSurvivorsCount,
      nonHolocaustSurvivors: nonHolocaustSurvivorsCount,
      total: totalClients,
    };
  } catch (error) {
    console.error("Failed to fetch event client data:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to fetch event client data"
    );
  }
};

const getEvents = async (req: Request) => {
  try {
    const {
      eventType,
      filterType,
      searchQuery,
      sortField = "dayOfEvent",
      sortOrder = "asc",
      page = 1,
      limit = 10,
    } = req.query;

    // console.log("all events", eventType, filterType, searchQuery, sortField);

    const query: any = {};
    if (eventType) {
      query.eventType = eventType;
    }

    if (filterType) {
      const currentDate = new Date();
      console.log("date", currentDate);
      if (filterType === "upcoming") {
        query.dayOfEvent = { $gt: currentDate };
      } else if (filterType === "today") {
        const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
        query.dayOfEvent = { $gte: startOfDay, $lte: endOfDay };
      } else if (filterType === "previous") {
        query.dayOfEvent = { $lt: currentDate };
      }
    }

    if (searchQuery) {
      query.eventName = { $regex: searchQuery, $options: "i" };
    }

    const sort: any = {};
    //@ts-ignore
    sort[sortField] = sortOrder === "desc" ? -1 : 1;

    const pageNumber = Math.max(1, parseInt(page as string, 10));
    const pageLimit = Math.max(1, parseInt(limit as string, 10));
    const skip = (pageNumber - 1) * pageLimit;

    const result = await Events.find(query)
      .sort(sort)
      .skip(skip)
      .limit(pageLimit);

    const totalCount = await Events.countDocuments(query);

    return {
      data: result,
      meta: {
        totalCount,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / pageLimit),
        pageLimit,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new ApiError(httpStatus.BAD_REQUEST, message);
  }
};

const updateEvent = async (req: Request) => {
  const { eventId } = req.params;
  const updatePayload = req.body;
  try {
    const updatedEvent = await Events.findByIdAndUpdate(
      eventId,
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
    }

    return updatedEvent;
  } catch (error) {
    console.error("Failed to update event:", error);
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update event");
  }
};

const deleteEvent = async (req: Request) => {
  const { eventId } = req.params;
  try {
    const deletedEvent = await Events.findByIdAndDelete(eventId);
    if (!deletedEvent) {
      throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
    }

    return deletedEvent;
  } catch (error) {
    console.error("Failed to delete event:", error);
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to delete event");
  }
};

const addClients = async (req: Request) => {
  const { eventId } = req.query;
  const { email, userId, type } = req.body as {
    email: string;
    userId: string;
    type: string;
  };

  const eventDb = (await Events.findById(eventId)) as IEvents;
  if (!eventDb) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }

  const typeOfUser =
    type === "client"
      ? "Client"
      : type === "warehouse"
      ? "Warehouse Volunteers"
      : "Driver Volunteers";
  let existingClient;
  if (type === "client") {
    existingClient = eventDb.client.find((client) => client.email === email);
  } else if (type === "warehouse") {
    existingClient = eventDb.warehouse.find(
      (warehouse) => warehouse.email === email
    );
  } else if (type === "driver") {
    existingClient = eventDb.driver.find((driver) => driver.email === email);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid type provided.");
  }

  if (existingClient) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `${typeOfUser} with this email already exists.`
    );
  }

  const userDb = await TransportVolunteerTable.findById(userId);
  if (!userDb) {
    throw new ApiError(httpStatus.NOT_FOUND, "Client not found.");
  }

  const validTypes = ["client", "warehouse", "driver"];
  if (!validTypes.includes(type)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid type provided.");
  }

  const updateField =
    type === "client"
      ? "client"
      : type === "warehouse"
      ? "warehouse"
      : "driver";
  const result = await Events.findByIdAndUpdate(
    eventId,
    { $push: { [updateField]: { userId, email } } },
    { new: true, runValidators: true }
  );

  // Send email request
  await sendUserRequest({
    email,
    subject: "Events Request",
    html: sendUserRequestBody({
      email,
      name: `${userDb.firstName} ${userDb.lastName}`,
      url: `http://${Config.base_url}:${Config.port}/api/v1/events/accept-request/${eventId}/${userId}`,
      frontend_url: "http://10.0.60.118:7000/accept-request",
      type: typeOfUser,
      event_name: eventDb.eventName,
      event_type: eventDb.eventType,
      event_location: eventDb.location,
      event_day_of_event: eventDb.dayOfEvent,
      event_start_of_event: eventDb.startOfEvent,
      event_end_of_event: eventDb.endOfEvent,
    }),
  });

  return { message: "Client added successfully", result };
};

const removeClientByEmail = async (req: Request) => {
  const { eventId } = req.query;
  const { email, type } = req.body as { email: string; type: string };

  const eventDb = (await Events.findById(eventId)) as IEvents;
  if (!eventDb) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }

  const updateField =
    type === "client"
      ? "client"
      : type === "warehouse"
      ? "warehouse"
      : type === "driver"
      ? "driver"
      : null;

  if (!updateField) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid type provided.");
  }

  const existingClient = eventDb[updateField].find(
    (entry) => entry.email === email
  );
  if (!existingClient) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } with this email not found in the event.`
    );
  }

  const result = await Events.findByIdAndUpdate(
    eventId,
    { $pull: { [updateField]: { email } } },
    { new: true, runValidators: true }
  );

  return {
    message: `${
      type.charAt(0).toUpperCase() + type.slice(1)
    } removed successfully`,
    result,
  };
};

export const EventService = {
  createEvent,
  getEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  addClients,
  removeClientByEmail,
};
