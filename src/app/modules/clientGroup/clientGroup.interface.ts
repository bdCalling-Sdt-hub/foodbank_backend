import { Model, Schema, Types } from "mongoose";
import { ITransportVolunteer } from "../TransportVolunteer/TransportVolunteer.interface";

export type IClientGroup = {
  clientGroupName: string;
  // clientMember: Types.Array<Schema.Types.ObjectId | ITransportVolunteer>;
  clients: Types.Array<Schema.Types.ObjectId> | ITransportVolunteer;
};

export type IClientGroupMethods = Model<IClientGroup, Record<string, unknown>>;
