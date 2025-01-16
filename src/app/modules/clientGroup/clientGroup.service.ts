import { TransportVolunteerTable } from "../TransportVolunteer/TransportVolunteer.model";
import { IClientGroup } from "./clientGroup.interface";
import { ClientGroupTable } from "./clientGroup.model";

// client group service
const CreateClientGroupService = async (
  payload: IClientGroup
): Promise<IClientGroup> => {
  console.log(payload);
  const meetings = await ClientGroupTable.create(payload);

  // Add this meeting to each client's `meetings` field
  await TransportVolunteerTable.updateMany(
    { _id: { $in: payload.clients } },
    { $push: { meetings: meetings._id } }
  );

  return meetings;
};

// client group service
const GetAllClientGroupService = async (): Promise<IClientGroup[]> => {
  const result = await ClientGroupTable.find();
  return result;
};

export const ClientGroupService = {
  CreateClientGroupService,
  GetAllClientGroupService,
};
