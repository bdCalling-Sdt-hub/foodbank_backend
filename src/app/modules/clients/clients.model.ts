import { model, Schema } from "mongoose";
import { ClientMethods, IClient } from "./clients.interface";

const clientSchema = new Schema<IClient, ClientMethods>(
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
      required: true,
    },

    dateOfBirth: {
      type: String,
      trim: true,
      required: true,
    },

    phoneNo: {
      type: Number,
      trim: true,
      required: true,
    },
    alternativePhoneNo: {
      type: Number,
      trim: true,
      required: true,
    },

    address: {
      type: String,
      trim: true,
      required: true,
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
      required: true,
    },
    dietaryRestrictions: {
      type: String,
      trim: true,
      required: true,
    },
    deliveryInstructions: {
      type: String,
      trim: true,
      required: true,
    },
    clientDeliveryGroup: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const ClientTable = model<IClient, ClientMethods>(
  "clients",
  clientSchema
);
