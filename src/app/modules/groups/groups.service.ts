import { IGroups } from "./groups.interface";
import { Groups } from "./groups.model";

const GetAllGroupsService = async (payload: IGroups): Promise<IGroups> => {
  const result = await Groups.create(payload);
  return result;
};

export const GroupsService = {
  GetAllGroupsService,
};
