import { Model, Schema, Types } from "mongoose";
import { ITransportVolunteer } from "../TransportVolunteer/TransportVolunteer.interface";

export type IClientGroup = {
  clientGroupName: string;
  clients: Types.Array<Schema.Types.ObjectId> | ITransportVolunteer;
};

export type IClientGroupMethods = Model<IClientGroup, Record<string, unknown>>;

export type IClientGroupFilters = {
  searchTerm?: string;
  clientGroupName: string;
};
