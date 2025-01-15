import httpStatus from "http-status";
import ApiError from "../../../error/APIsError";
import { ITransportVolunteer } from "../TransportVolunteer/TransportVolunteer.interface";
import { TransportVolunteerTable } from "../TransportVolunteer/TransportVolunteer.model";

const GetAllDriverService = async () => {
  const driver = await TransportVolunteerTable.aggregate([
    {
      $match: {
        status: "driver",
      },
    },
  ]);

  return driver;
};

// get single driver
const GetSingleDriverService = async (
  id: string
): Promise<Partial<ITransportVolunteer>> => {
  const driver = await TransportVolunteerTable.findById(id);

  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, "Client does not exists!");
  }

  return driver;
};

// update single drive
const UpdateSingleDriverService = async (
  id: string,
  payload: Partial<ITransportVolunteer>
): Promise<Partial<ITransportVolunteer | null>> => {
  const driver = await TransportVolunteerTable.findById(id);

  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, "Driver does not exists!");
  }

  const update = await TransportVolunteerTable.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );

  return update;
};

export const DriverService = {
  GetAllDriverService,
  GetSingleDriverService,
  UpdateSingleDriverService,
};
