import { model, Schema } from "mongoose";
import { GroupModels, IGroups } from "./groups.interface";

const groupSchema = new Schema<IGroups, GroupModels>(
  {
    groupName: {
      type: String,
      trim: true,
      required: [true, "Group name is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["clientGroup", "volunteerGroup", "warehouseGroup"], // clientGroup | volunteerGroup | warehouseGroup
        message: "{VALUE} is not a valid event type",
      },
      required: [true, "Status type is required"],
    },
    volunteerType: {
      type: String,
      enum: {
        values: ["driver", "warehouse"], // driver | warehouse
        message: "{VALUE} is not a valid event type",
      },
      required: [true, "Volunteer type is required"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Groups = model<IGroups, GroupModels>("Groups", groupSchema);
