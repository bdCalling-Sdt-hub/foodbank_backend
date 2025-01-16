import { model, Schema, Types } from "mongoose";
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
    email: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["client", "driver", "warehouse"],
        message: `{VALUE} is not supported`,
      },
      trim: true,
      required: true,
    },

    volunteerRole: {
      type: String,
      enum: ["driver", "warehouse", "both"],
      trim: true,
    },
    volunteerType: {
      type: Boolean,
      default: false,
      trim: true,
    },
    meetings: [{ type: Types.ObjectId, ref: "ClientGroups" }],
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
>("TransportVolunteers", TransportVolunteerSchema);
