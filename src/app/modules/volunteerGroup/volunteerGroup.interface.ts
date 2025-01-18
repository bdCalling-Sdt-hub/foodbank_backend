import { Model, Schema, Types } from "mongoose";
import { ITransportVolunteer } from "../TransportVolunteer/TransportVolunteer.interface";

type IVolunteerType = "driver" | "warehouse";
export type IVolunteerGroup = {
  volunteerGroupName: string;
  volunteerType: IVolunteerType; // driver | warehouse
  volunteers: Types.Array<Schema.Types.ObjectId> | ITransportVolunteer;
};

export type VolunteerGroupModel = Model<
  IVolunteerGroup,
  Record<string, unknown>
>;

export type IVolunteerFilters = {
  searchTerm?: string;
  volunteerGroupName: string;
  volunteerType: string;
};
