import httpStatus from "http-status";
import ApiError from "../../../error/APIsError";
import { IUser } from "../users/user.interface";
import Events from "./events.model";
import { Request } from "express";

const createEvent = async (payload: IEvents): Promise<IEvents | null> => {
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
        const getEvent = await Events.findById(eventId);
        if (!getEvent) {
            throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
        }

        return getEvent;
    } catch (error) {
        console.error("Failed to delete event:", error);
    }
};


const getEvents = async () => {
    try {
        const result = await Events.find({});
        return result;
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



export const EventService = {
    createEvent,
    getEvent,
    getEvents,
    updateEvent,
    deleteEvent
};
