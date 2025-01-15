import { model, Schema } from "mongoose";
import {
  ITransportVolunteer,
  TransportVolunteerMethods,
} from "./TransportVolunteer.interface";

const TransportVolunteerSchema = new Schema<
  ITransportVolunteer,
  TransportVolunteerMethods
>(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },

    holocaustSurvivor: {
      type: String,
      trim: true,
    },

    dateOfBirth: {
      type: String,
      trim: true,
    },

    phoneNo: {
      type: Number,
      trim: true,
      required: true,
    },
    alternativePhoneNo: {
      type: Number,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },
    apartment: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
    peopleHousehold: {
      type: String,
      trim: true,
    },
    badgeNumber: {
      type: Number,
      trim: true,
    },
    dietaryRestrictions: {
      type: String,
      trim: true,
    },
    deliveryInstructions: {
      type: String,
      trim: true,
    },
    clientDeliveryGroup: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["client", "driver", "warehouse"],
      trim: true,
      required: true,
    },

    volunteerRole: {
      type: String,
      enum: ["driver", "warehouse", "both"],
      trim: true,
    },
    volunteerType: {
      type: String,
      enum: ["vip", "regular"],
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const TransportVolunteerTable = model<
  ITransportVolunteer,
  TransportVolunteerMethods
>("transportVolunteers", TransportVolunteerSchema);
