import httpStatus from "http-status";
import ApiError from "../../../error/APIsError";
import { ITransportVolunteer } from "../TransportVolunteer/TransportVolunteer.interface";
import { TransportVolunteerTable } from "../TransportVolunteer/TransportVolunteer.model";

const GetAllWarehouseService = async () => {
  const warehouse = await TransportVolunteerTable.aggregate([
    {
      $match: {
        status: "warehouse",
      },
    },
  ]);

  return warehouse;
};

// get single Warehouse
const GetSingleWarehouseService = async (
  id: string
): Promise<Partial<ITransportVolunteer>> => {
  const warehouse = await TransportVolunteerTable.findById(id);

  if (!warehouse) {
    throw new ApiError(httpStatus.NOT_FOUND, "Client does not exists!");
  }

  return warehouse;
};

// update single drive
const UpdateSingleWarehouseService = async (
  id: string,
  payload: Partial<ITransportVolunteer>
): Promise<Partial<ITransportVolunteer | null>> => {
  const warehouse = await TransportVolunteerTable.findById(id);

  if (!warehouse) {
    throw new ApiError(httpStatus.NOT_FOUND, "Warehouse does not exists!");
  }

  const update = await TransportVolunteerTable.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );

  return update;
};

export const WarehouseService = {
  GetAllWarehouseService,
  GetSingleWarehouseService,
  UpdateSingleWarehouseService,
};
