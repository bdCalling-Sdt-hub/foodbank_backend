import { IClientGroup } from "./clientGroup.interface";
import { ClientGroupTable } from "./clientGroup.model";

// client group service
const CreateClientGroupService = async (
  payload: IClientGroup
): Promise<IClientGroup> => {
  const result = await ClientGroupTable.create(payload);
  return result;
};

// client group service
const GetAllClientGroupService = async (): Promise<IClientGroup[]> => {
  const result = await ClientGroupTable.find().populate("client");
  return result;
};

export const ClientGroupService = {
  CreateClientGroupService,
  GetAllClientGroupService,
};
