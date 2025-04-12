import { Request } from "express";
import httpStatus from "http-status";
import mongoose, { Types } from "mongoose";
import Config from "../../../config/Config";
import ApiError from "../../../error/APIsError";
import sendUserRequest from "../../../mail/sendUserRequest";
import { sendUserRequestBody } from "../../../mail/sendUserRequestBody";
import { Groups } from "../groups/groups.model";
import { TransportVolunteerTable } from "../TransportVolunteer/TransportVolunteer.model";
import Events from "./events.model";
import { format } from "date-fns";
import moment from 'moment-timezone';
import { expiredRequest } from "../../../mail/expiredRequest";

const createEvent = async (payload: IEvents): Promise<IEvents | null> => {
  console.log("console from service page", payload);

  try {
    if (payload?.dayOfEvent) {
      payload.dayOfEvent = moment.tz(payload.dayOfEvent, "America/New_York").toDate();
    }

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
          select: "groupName volunteerType id",
        },
      })
      .populate({
        path: "client",
        populate: {
          path: "userId",
          // select: "firstName lastName holocaustSurvivor phoneNo",
        },
      })
      .populate({
        path: "client",
        populate: {
          path: "assignedUId",
          // select: "firstName lastName holocaustSurvivor phoneNo",
        },
      })
      .populate({
        path: "warehouse",
        populate: {
          path: "userId",
          select: "firstName lastName holocaustSurvivor phoneNo",
        },
      })
      .populate({
        path: "driver",
        populate: {
          path: "userId",
          select: "firstName lastName holocaustSurvivor phoneNo",
        },
      });

    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
    }

    let holocaustSurvivorsCount = 0;
    let nonHolocaustSurvivorsCount = 0;

    for (const clientObj of event.client) {
      const client: any = await TransportVolunteerTable.findById(clientObj.userId);
      if (client) {
        if (client.holocaustSurvivor === true) {
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

  if (updatePayload?.dayOfEvent) {
    updatePayload.dayOfEvent = moment.tz(updatePayload.dayOfEvent, "America/New_York").toDate();
  }

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
    console.log("eventId", eventId)
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
  if (type !== "client") {

    console.log("eventDb", eventDb)

    // Send email request
    const emailRes = await sendUserRequest({
      email,
      subject: "Events Request",
      html: sendUserRequestBody({
        email,
        name: `${userDb.firstName} ${userDb.lastName}`,
        url: `https://backend.volunhelp.com/api/v1/events/accept-request/${eventId}/${userId}/${type}`,
        frontend_url: `https://volunhelp.com/accept-request/event/${eventId}/user/${userId}/type/${type}`,
        cancel_url: `https://volunhelp.com/cancel-request/event/${eventId}/user/${userId}/type/${type}`,
        type: typeOfUser,
        event_name: eventDb.eventName,
        message: type === "driver" ? eventDb.messageDeliveryDriver : eventDb.messageWarehouseVolunteer,
        event_type: eventDb.eventType.replace(/([a-z])([A-Z])/g, '$1 $2'),
        event_location: eventDb.location,
        event_day_of_event: format(new Date(eventDb.dayOfEvent), "MMMM d, yyyy"),
        event_start_of_event: eventDb.startOfEvent,
        event_end_of_event: eventDb.endOfEvent,
      }),
    });

    console.log('emailRes', email, emailRes)
  }
  return { message: "Client added successfully", result };
};

const acceptRequest = async (req: Request) => {
  const { eventId, userId, type, from } = req.query as {
    eventId: string;
    userId: string;
    type: string;
    from: string
  };

  if (!eventId || !userId || !type || !from) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing required parameters");
  }

  console.log("==========", eventId, userId, type, from)

  const eventDb = await Events.findById(eventId);
  if (!eventDb) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }

  const userDb = await TransportVolunteerTable.findById(userId);
  if (!userDb) {
    throw new ApiError(httpStatus.NOT_FOUND, "Client not found.");
  }
  const email = userDb.email as string;

  if (type === "driver") {
    const countConfirm = eventDb.driver.filter(data => data.accept === true).length;

    const alreadyAccepted = eventDb.driver.filter(data => data.userId.toString() === userId && data.accept === true)
    console.log("==========sss", alreadyAccepted)
    if (alreadyAccepted?.length) {
      return {
        status: false,
        message: "Your request already accepted successfully"
      };
    }

    if (countConfirm >= eventDb.deliveryNeeded && from === 'admin') {
      throw new ApiError(400, "At this time, all role have been filed.");
    } else if (countConfirm >= eventDb.deliveryNeeded && from === 'user') {
      const emailRes = await sendUserRequest({
        email,
        subject: "Events Request",
        html: expiredRequest({
          email,
          name: `${userDb.firstName} ${userDb.lastName}`
        }),
      });
      return {
        status: false,
        message: "Thank you for your interest in joining us. Currently, all positions are filled, but we will contact you if a vacancy opens up."
      };
    }
    const driver = eventDb.driver.find((driver: any) =>
      driver.userId.equals(userId)
    );
    if (driver) {
      driver.accept = true;
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, "Driver not found");
    }
  } else if (type === "warehouse") {
    const countConfirm = eventDb.warehouse.filter(data => data.accept === true).length;
    const alreadyAccepted = eventDb.warehouse.filter(data => data.userId.toString() === userId && data.accept === true)

    if (alreadyAccepted?.length) {
      return {
        status: false,
        message: "Your request already accepted successfully"
      };
    }

    if (countConfirm >= eventDb.warehouseNeeded && from === 'admin') {
      throw new ApiError(400, "At this time, all role have been filed.");
    } else if (countConfirm >= eventDb.warehouseNeeded && from === 'user') {
      const emailRes = await sendUserRequest({
        email,
        subject: "Events Request",
        html: expiredRequest({
          email,
          name: `${userDb.firstName} ${userDb.lastName}`
        }),
      });
      return {
        status: false,
        message: "Thank you for your interest in joining us. Currently, all positions are filled, but we will contact you if a vacancy opens up."
      };
    }
    const warehouse = eventDb.warehouse.find((warehouse: any) =>
      warehouse.userId.equals(userId)
    );
    if (warehouse) {
      warehouse.accept = true;
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, "Warehouse volunteer not found");
    }
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid type. Allowed types: driver, warehouse"
    );
  }
  await eventDb.save();
  return {
    status: true,
    message: "Request accepted successfully"
  };
};

const cancelRequest = async (req: Request) => {
  const { eventId, userId, type } = req.query as {
    eventId: string;
    userId: string;
    type: string;
  };

  if (!eventId || !userId || !type) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing required parameters");
  }

  const eventDb = await Events.findById(eventId) as any;
  if (!eventDb) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }

  if (type === "driver") {
    const initialDriverCount = eventDb.driver.length;
    eventDb.driver = eventDb.driver.filter(
      (driver: any) => !driver.userId.equals(userId)
    );
    if (initialDriverCount === eventDb.driver.length) {
      throw new ApiError(httpStatus.NOT_FOUND, "Driver not found");
    }
  } else if (type === "warehouse") {
    const initialWarehouseCount = eventDb.warehouse.length;
    eventDb.warehouse = eventDb.warehouse.filter(
      (warehouse: any) => !warehouse.userId.equals(userId)
    );
    if (initialWarehouseCount === eventDb.warehouse.length) {
      throw new ApiError(httpStatus.NOT_FOUND, "Warehouse volunteer not found");
    }
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid type. Allowed types: driver, warehouse"
    );
  }
  await eventDb.save();

  return { message: "User successfully removed from the event" };
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
      `${type.charAt(0).toUpperCase() + type.slice(1)
      } with this email not found in the event.`
    );
  }

  const result = await Events.findByIdAndUpdate(
    eventId,
    { $pull: { [updateField]: { email } } },
    { new: true, runValidators: true }
  );

  return {
    message: `${type.charAt(0).toUpperCase() + type.slice(1)
      } removed successfully`,
    result,
  };
};

const addGroupUpdate = async (payload: {
  groupId: string;
  eventId: string;
  types: string;
}) => {
  try {
    const { groupId, eventId, types } = payload;

    if (!groupId || !eventId || !types) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Missing required parameters."
      );
    }

    const groups = await Groups.findById(groupId).populate({ path: "clients", select: "status email _id" });
    if (!groups) {
      throw new ApiError(httpStatus.NOT_FOUND, "Group not found");
    }

    const eventDb = (await Events.findById(eventId)) as IEvents;
    if (!eventDb) {
      throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
    }

    const existingClient = eventDb.groups.find(
      (client) => client.gid.toString() === groupId && client.type === types
    );

    if (existingClient) {
      throw new ApiError(
        httpStatus.CONFLICT,
        `${types} with this groupId already exists.`
      );
    }

    const objectIdGroupId = new mongoose.Types.ObjectId(groupId);
    const result = await Events.findByIdAndUpdate(
      eventId,
      { $push: { groups: { gid: objectIdGroupId, type: types } } },
      { new: true, runValidators: true }
    );

    const clients = groups?.clients;

    if (clients?.length) {
      for (const client of clients) {
        // @ts-ignore
        addToClientsGroups({ email: client.email, userId: client._id, type: types, eventId })
      }
    }
    return { message: "Group update added successfully", result };
  } catch (error: any) {
    console.error("Failed to add group update:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const addToClientsGroups = async ({ email, userId, type, eventId }: {
  email: string;
  eventId: Types.ObjectId;
  type: string;
  userId: Types.ObjectId;
}) => {

  console.log("Group update added successfully", email, userId, type, eventId)

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
    return;
  }

  if (existingClient) {
    return;
  }

  const userDb = await TransportVolunteerTable.findById(userId);
  if (!userDb) {
    throw new ApiError(httpStatus.NOT_FOUND, "Client not found.");
  }

  const validTypes = ["client", "warehouse", "driver"];
  if (!validTypes.includes(type)) {
    return;
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
  console.log(result);
  if (type !== "client") {
    // Send email request
    const emailRes = await sendUserRequest({
      email,
      subject: "Events Request",
      html: sendUserRequestBody({
        email,
        name: `${userDb.firstName} ${userDb.lastName}`,
        url: `https://backend.volunhelp.com/api/v1/events/accept-request/${eventId}/${userId}/${type}`,
        frontend_url: `https://volunhelp.com/accept-request/event/${eventId}/user/${userId}/type/${type}`,
        cancel_url: `https://volunhelp.com/cancel-request/event/${eventId}/user/${userId}/type/${type}`,
        type: typeOfUser,
        message: type === "driver" ? eventDb.messageDeliveryDriver : eventDb.messageWarehouseVolunteer,
        event_name: eventDb.eventName,
        event_type: eventDb.eventType.replace(/([a-z])([A-Z])/g, '$1 $2'),
        event_location: eventDb.location,
        event_day_of_event: format(new Date(eventDb.dayOfEvent), "MMMM d, yyyy"),
        event_start_of_event: eventDb.startOfEvent,
        event_end_of_event: eventDb.endOfEvent,
      }),
    });

    console.log('emailRes', email, emailRes)
  }
  return { message: "Client added successfully", result };
};

const removeGroupUpdate = async (payload: {
  groupId: string;
  eventId: string;
  types: string;
}) => {
  try {
    const { groupId, eventId, types } = payload;

    if (!groupId || !eventId || !types) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Missing required parameters."
      );
    }

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid groupId.");
    }
    const objectIdGroupId = new mongoose.Types.ObjectId(groupId);

    const eventDb = await Events.findById(eventId);
    if (!eventDb) {
      throw new ApiError(httpStatus.NOT_FOUND, "Event not found.");
    }

    const existingGroup = eventDb.groups.find(
      (group) => group.gid.toString() === groupId && group.type === types
    );

    if (!existingGroup) {
      throw new ApiError(httpStatus.NOT_FOUND, "Group not found in event.");
    }

    console.log("update", groupId, eventId, types);

    const result = await Events.findByIdAndUpdate(
      eventId,
      { $pull: { groups: { gid: objectIdGroupId, type: types } } },
      { new: true, runValidators: true }
    );
    const groups = await Groups.findById(groupId).populate("clients")

    if (groups?.clients) {
      for (const client of groups.clients) {
        // @ts-ignore 
        removeClientGroups({ email: client.email, type: types, eventId })
      }
    }

    return { message: "Group removed successfully", result };
  } catch (error: any) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to remove group update"
    );
  }
};

const removeClientGroups = async ({ email, type, eventId }: {
  email: string;
  eventId: Types.ObjectId;
  type: string;
  userId: Types.ObjectId;
}) => {
  const eventDb = (await Events.findById(eventId)) as IEvents;
  if (!eventDb) {
    return;
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
    return
  }

  const existingClient = eventDb[updateField].find(
    (entry) => entry.email === email
  );

  if (!existingClient) {
    return
  }

  const result = await Events.findByIdAndUpdate(
    eventId,
    { $pull: { [updateField]: { email } } },
    { new: true, runValidators: true }
  );

  return {
    message: `${type.charAt(0).toUpperCase() + type.slice(1)
      } removed successfully`,
    result,
  };
};

const getEventsGroups = async (payload: IGetGroups) => {
  try {
    const {
      type,
      eventId,
      page = 1,
      limit = 10,
      searchQuery = "",
    } = payload as IGetGroups;

    const validTypes = ["client", "driver", "warehouse"];
    if (!validTypes.includes(type)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid type parameter.");
    }
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid eventId.");
    }

    const objectIdEventId = new mongoose.Types.ObjectId(eventId);
    const skip = (page - 1) * limit;

    const result = await Events.aggregate([
      {
        $match: {
          _id: objectIdEventId,
        },
      },
      {
        $project: {
          _id: 0,
          filteredGroups: {
            $filter: {
              input: "$groups",
              as: "group",
              cond: { $eq: ["$$group.type", type] },
            },
          },
        },
      },
      {
        $unwind: "$filteredGroups",
      },
      {
        $lookup: {
          from: "clientgroups",
          localField: "filteredGroups.gid",
          foreignField: "_id",
          as: "filteredGroups.gid",
        },
      },
      {
        $unwind: "$filteredGroups.gid",
      },
      ...(searchQuery
        ? [
          {
            $match: {
              "filteredGroups.gid.clientGroupName": {
                $regex: searchQuery,
                $options: "i",
              },
            },
          },
        ]
        : []),
      {
        $project: {
          "filteredGroups.gid.clients": 0,
          "filteredGroups.gid.createdAt": 0,
          "filteredGroups.gid.updatedAt": 0,
          "filteredGroups.gid.__v": 0,
        },
      },
      {
        $group: {
          _id: null,
          groups: { $push: "$filteredGroups" },
        },
      },
      {
        $project: {
          groups: { $slice: ["$groups", skip, limit] },
        },
      },
    ]);

    const totalResult = await Events.aggregate([
      {
        $match: {
          _id: objectIdEventId,
        },
      },
      {
        $project: {
          _id: 0,
          totalGroups: {
            $size: {
              $filter: {
                input: "$groups",
                as: "group",
                cond: { $eq: ["$$group.type", type] },
              },
            },
          },
        },
      },
      ...(searchQuery
        ? [
          {
            $match: {
              "filteredGroups.gid.clientGroupName": {
                $regex: searchQuery,
                $options: "i",
              },
            },
          },
        ]
        : []),
    ]);

    const totalGroups = totalResult.length > 0 ? totalResult[0].totalGroups : 0;

    return {
      data: result.length > 0 ? result[0].groups : [],
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalGroups / limit),
        totalGroups,
        pageLimit: limit,
      },
    };
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to fetch groups."
    );
  }
};

const getEventDrivers = async (req: Request) => {
  try {
    const { eventId, page = 1, limit = 10, searchTerm, accept, types } = req.query;

    if (!eventId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Event ID is required");
    }

    const event = await Events.findById(eventId).populate({
      path: "driver.userId",
      // select: "firstName lastName email",
    })
      .populate({
        path: "warehouse.userId",
        // select: "firstName lastName email",
      })

    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
    }

    let drivers;
    if (types === "driver") {
      drivers = event.driver.filter((driver) => accept === "yes" ? driver.accept : !driver.accept);
    } else if (types === "warehouse") {
      drivers = event.warehouse.filter((driver) => accept === "yes" ? driver.accept : !driver.accept);
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, "Invalid types")
    }


    if (searchTerm) {
      const regex = new RegExp(searchTerm as string, "i");
      drivers = drivers.filter((driver: any) => {
        const { firstName, lastName } = driver.userId || {};
        return regex.test(firstName || "") || regex.test(lastName || "");
      });
    }


    const updatedDrivers = drivers.map((driver) => {
      const assigned = event?.client?.filter((cl: any) => {
        const assignedUId = cl?.assignedUId;
        //@ts-ignore
        const driverId = driver?.userId?._id;

        return assignedUId && driverId && assignedUId.toString() === driverId.toString();
      });

      const total = assigned.length || 0;

      return {
        driver,
        assignedClientCount: total,
      };
    });


    const pageNumber = parseInt(page as string, 10);
    const pageLimit = parseInt(limit as string, 10);
    const paginatedDrivers = updatedDrivers.slice(
      (pageNumber - 1) * pageLimit,
      pageNumber * pageLimit
    );

    console.log("paginatedDrivers", updatedDrivers)

    return {
      data: paginatedDrivers,
      meta: {
        totalCount: updatedDrivers.length,
        currentPage: pageNumber,
        totalPages: Math.ceil(updatedDrivers.length / pageLimit),
        pageLimit,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new ApiError(httpStatus.BAD_REQUEST, message);
  }
};

const assignedClients = async (req: Request) => {
  try {
    const { eventId, clientId, volunteerId } = req.query;

    if (!eventId || !clientId || !volunteerId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Missing required parameters");
    }

    const event = await Events.findById(eventId);
    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
    }

    const client = event.client.find((c) => c.userId.toString() === clientId) as any;

    if (!client) {
      throw new ApiError(httpStatus.NOT_FOUND, "Client not found in event");
    }

    if (client.assignedUId?.toString() === volunteerId) {
      client.assignedUId = null;
      client.assigned = false;
    } else {
      client.assignedUId = volunteerId;
      client.assigned = true;
    }
    await event.save();

    return event
  } catch (error: any) {
    throw new ApiError(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message || "An error occurred")
  }
};

const getAssignedClientsForEvent = async (req: Request) => {
  try {
    const { eventId } = req.query;

    console.log("======", eventId)
    if (!eventId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Event ID is required");
    }

    const event = await Events.findById(eventId)
      .populate("client.userId")
      .populate("client.assignedUId");

    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
    }

    const assignedClients = event.client.filter((c: any) => c.assigned === true);

    console.log("======", event.client.length)

    console.log("assignedClients", assignedClients.length)

    return { eventDetails: event, assignedClients };
  } catch (error: any) {
    throw new ApiError(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message || "An error occurred");
  }
};

const confirmedClientsStatusUpdate = async (req: Request) => {
  try {
    const { eventId, clientId, confirmed } = req.query;

    console.log("==========", eventId, clientId, confirmed)

    if (!eventId || !clientId || !confirmed) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Missing required parameters");
    }

    const validConfirmedValues = ["Not-Called", "Confirmed", "Unable-to-Reach", "Rescheduled", "Skip-Month"];
    if (!validConfirmedValues.includes(confirmed as string)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid confirmed value");
    }

    const event = await Events.findById(eventId);
    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
    }

    const client = event.client.find((c) => c.userId.toString() === clientId) as any;

    if (!client) {
      throw new ApiError(httpStatus.NOT_FOUND, "Client not found in event");
    }

    client.confirmed = confirmed;
    await event.save();

    console.log("dksa", event)

    return event;
  } catch (error: any) {
    throw new ApiError(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message || "An error occurred");
  }
};

// const getEventClients = async (req: Request) => {
//   const { eventId } = req.params;

//   try {
//     const event = await Events.findById(eventId)
//       .populate("client.userId")
//       .populate({
//         path: "groups",
//         populate: {
//           path: "gid",
//           select: "groupName volunteerType id",
//         },
//       })
//       .populate({
//         path: "client",
//         populate: {
//           path: "userId",
//         },
//       })
//       .populate({
//         path: "client",
//         populate: {
//           path: "assignedUId",
//         },
//       })

//     if (!event) {
//       throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
//     }

//     let holocaustSurvivorsCount = 0;
//     let nonHolocaustSurvivorsCount = 0;

//     for (const clientObj of event.client) {
//       const client: any = await TransportVolunteerTable.findById(clientObj.userId);
//       if (client) {
//         if (client.holocaustSurvivor === true) {
//           holocaustSurvivorsCount++;
//         } else {
//           nonHolocaustSurvivorsCount++;
//         }
//       }
//     }

//     const totalClients = holocaustSurvivorsCount + nonHolocaustSurvivorsCount;

//     return {
//       event,
//       holocaustSurvivors: holocaustSurvivorsCount,
//       nonHolocaustSurvivors: nonHolocaustSurvivorsCount,
//       total: totalClients,
//     };
//   } catch (error) {
//     console.error("Failed to fetch event client data:", error);
//     throw new ApiError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to fetch event client data"
//     );
//   }
// };

export const EventService = {
  createEvent,
  getEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  addClients,
  removeClientByEmail,
  addGroupUpdate,
  removeGroupUpdate,
  getEventsGroups,
  getEventDrivers,
  acceptRequest,
  cancelRequest,
  assignedClients,
  confirmedClientsStatusUpdate,
  getAssignedClientsForEvent
  // getEventClients
};
