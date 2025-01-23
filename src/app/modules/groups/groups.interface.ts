import { Model, Types } from "mongoose";

type GroupType = "client" | "driver" | "warehouse";
type IVolunteerType = "driver" | "warehouse";

export type IGroups = {
  groupName: string;
  status: GroupType; // clientGroup | volunteerGroup | warehouseGroup
  types: string;
  volunteerType?: IVolunteerType; // driver | warehouse
  clients: [Types.ObjectId];
};

export type GroupModels = Model<IGroups, Record<string, unknown>>;
