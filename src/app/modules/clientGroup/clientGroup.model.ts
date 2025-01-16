import { model, Schema, Types } from "mongoose";
import { IClientGroup, IClientGroupMethods } from "./clientGroup.interface";

export const clientGroupSchema = new Schema<IClientGroup, IClientGroupMethods>(
  {
    clientGroupName: {
      type: String,
      trim: true,
      required: true,
    },

    // clientMember: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "ClientGroups",
    //     required: true,
    //   },
    // ],

    clients: [{ type: Types.ObjectId, ref: "TransportVolunteer" }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const ClientGroupTable = model<IClientGroup, IClientGroupMethods>(
  "ClientGroups",
  clientGroupSchema
);
