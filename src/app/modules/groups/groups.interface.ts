import { Model } from "mongoose";

type GroupType = "clientGroup" | "volunteerGroup" | "warehouseGroup";
type IVolunteerType = "driver" | "warehouse";

export type IGroups = {
  groupName: string;
  status: GroupType; // clientGroup | volunteerGroup | warehouseGroup
  volunteerType?: IVolunteerType; // driver | warehouse
};

export type GroupModels = Model<IGroups, Record<string, unknown>>;
