import { ITransportVolunteer } from "./TransportVolunteer.interface";
import { TransportVolunteerTable } from "./TransportVolunteer.model";

const CreateTransportVolunteerService = async (
  payload: ITransportVolunteer
): Promise<ITransportVolunteer> => {
  const result = await TransportVolunteerTable.create(payload);
  return result;
};

export const TransportVolunteerService = {
  CreateTransportVolunteerService,
};
