import { model, Schema, Types } from "mongoose";
import { GroupModels, IGroups } from "./groups.interface";

const groupSchema = new Schema<IGroups, GroupModels>(
  {
    groupName: {
      type: String,
      trim: true,
      required: [true, "Group name is required"],
    },
    types: {
      type: String,
      enum: {
        values: ["client", "driver", "warehouse"],
        message: "{VALUE} is not a valid type",
      },
      required: true,
    },

    volunteerType: {
      type: String,
      enum: {
        values: ["driver", "warehouse"], // driver | warehouse
        message: "{VALUE} is not a valid event type",
      },
      default: null,
      // required: [true, "Volunteer type is required"],
    },
    clients: [{ type: Types.ObjectId, ref: "TransportVolunteers" }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Groups = model<IGroups, GroupModels>("Groups", groupSchema);
