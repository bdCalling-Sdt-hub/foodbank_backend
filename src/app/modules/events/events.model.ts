
import mongoose, { Schema, Document, model } from "mongoose";
const { ObjectId } = Schema.Types;

export type EventType = "wed" | "birthday";

interface IUserObj {
  userId: Schema.Types.ObjectId;
  email: string;
  accept: boolean;
}

const UserObjSchema = new Schema<IUserObj>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'UserModel',
    required: true
  },
  email: { type: String, required: true },
  accept: { type: Boolean, default: false },
});

const EventSchema = new Schema<IEvents>({
  eventName: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    enum: ["wed", "birthday"],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  messageDeliveryDriver: {
    type: String,
    required: true
  },
  messageWarehouseVolunteer: {
    type: String,
    required: true
  },
  dayOfEvent: {
    type: String,
    required: true
  },
  startOfEvent: {
    type: String,
    required: true
  },
  endOfEvent: {
    type: String,
    required: true
  },
  deliveryNeeded: {
    type: Number,
    required: true
  },
  warehouseNeeded: {
    type: Number,
    required: true
  },
  driver: {
    type: [UserObjSchema],
    default: []
  },
  warehouse: {
    type: [UserObjSchema],
    default: []
  },
  client: {
    type: [UserObjSchema],
    default: []
  },
});

// Exporting the Model
const Events = model<IEvents>("Event", EventSchema);

export default Events;
