import httpStatus from "http-status";
import ApiError from "../../../error/APIsError";
import { ITransportVolunteer } from "./TransportVolunteer.interface";
import { TransportVolunteerTable } from "./TransportVolunteer.model";

// Create transport volunteer service
const CreateTransportVolunteerService = async (
  payload: ITransportVolunteer
): Promise<ITransportVolunteer> => {
  const result = await TransportVolunteerTable.create(payload);
  return result;
};

// Create transport volunteer service
const GetAllTransportVolunteerService = async (): Promise<
  ITransportVolunteer[]
> => {
  const result = await TransportVolunteerTable.find({}).sort({ createdAt: -1 });
  return result;
};

// Create transport volunteer service
const GetSingleTransportVolunteerService = async (
  id: string
): Promise<ITransportVolunteer | null> => {
  const result = await TransportVolunteerTable.findById(id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid volunteer!");
  }

  return result;
};

// Update single transport volunteer service
const UpdateSingleTransportVolunteerService = async (
  id: string,
  payload: Partial<ITransportVolunteer>
): Promise<Partial<ITransportVolunteer> | null> => {
  const result = await TransportVolunteerTable.findById(id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid volunteer!");
  }

  const updateVolunteer = await TransportVolunteerTable.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );

  return updateVolunteer;
};

export const TransportVolunteerService = {
  CreateTransportVolunteerService,
  GetAllTransportVolunteerService,
  GetSingleTransportVolunteerService,
  UpdateSingleTransportVolunteerService,
};
