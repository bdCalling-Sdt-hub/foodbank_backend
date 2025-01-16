import { model, Schema } from "mongoose";
import { IClientGroup, IClientGroupMethods } from "./clientGroup.interface";

const clientGroupSchema = new Schema<IClientGroup, IClientGroupMethods>(
  {
    clientGroupName: {
      type: String,
      trim: true,
      required: true,
    },

    clients: [
      {
        type: Schema.Types.ObjectId,
        ref: "Client",
      },
    ],
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
