import { model, Schema } from "mongoose";

export type EventType = "wed" | "birthday";

interface IUserObj {
  userId: Schema.Types.ObjectId;
  email: string;
  accept: boolean;
  assigned: boolean;
  assignedUId: Schema.Types.ObjectId
}

interface IGroup {
  gid: Schema.Types.ObjectId;
  type: string;
}

const UserObjSchema = new Schema<IUserObj>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "TransportVolunteers",
    required: true,
  },
  email: { type: String, required: true },
  accept: { type: Boolean, default: false },
  assigned: { type: Boolean, default: false },
  assignedUId: {
    type: Schema.Types.ObjectId,
    ref: "TransportVolunteers",
    default: null,
  },
});

const groupObject = new Schema<IGroup>({
  gid: {
    type: Schema.Types.ObjectId,
    ref: "Groups",
  },
  type: {
    type: String,
    enum: ["client", "warehouse", "driver"],
    required: true,
  },
});

const EventSchema = new Schema<IEvents>({
  eventName: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  messageDeliveryDriver: {
    type: String,
    required: true,
  },
  messageWarehouseVolunteer: {
    type: String,
    required: true,
  },
  dayOfEvent: {
    type: Date,
    required: true,
  },
  startOfEvent: {
    type: String,
    required: true,
  },
  endOfEvent: {
    type: String,
    required: true,
  },
  deliveryNeeded: {
    type: Number,
    required: true,
  },
  warehouseNeeded: {
    type: Number,
    required: true,
  },
  driver: {
    type: [UserObjSchema],
    default: [],
  },
  warehouse: {
    type: [UserObjSchema],
    default: [],
  },
  client: {
    type: [UserObjSchema],
    default: [],
  },
  groups: [groupObject],
});

// Exporting the Model
const Events = model<IEvents>("Event", EventSchema);

export default Events;
