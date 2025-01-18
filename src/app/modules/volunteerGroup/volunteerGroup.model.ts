import { model, Schema, Types } from "mongoose";
import {
  IVolunteerGroup,
  VolunteerGroupModel,
} from "./volunteerGroup.interface";

const volunteersGroupSchema = new Schema<IVolunteerGroup, VolunteerGroupModel>(
  {
    volunteerGroupName: {
      type: String,
      trim: true,
      required: [true, "Volunteer group name is required!"],
    },
    volunteerType: {
      type: String,

      trim: true,
      required: true,
      enum: {
        values: ["driver", "warehouse"],
        message: "{VALUE} is not supported",
      },
    },
    volunteers: [{ type: Types.ObjectId, ref: "TransportVolunteers" }],
  },

  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const VolunteerGroupT = model<IVolunteerGroup, VolunteerGroupModel>(
  "VolunteerGroupTable",
  volunteersGroupSchema
);
