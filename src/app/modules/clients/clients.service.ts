import httpStatus from "http-status";
import ApiError from "../../../error/APIsError";
import { ITransportVolunteer } from "../TransportVolunteer/TransportVolunteer.interface";
import { TransportVolunteerTable } from "../TransportVolunteer/TransportVolunteer.model";

// ------------------CLIENT APIs endpoint------------------
const GetAllClientService = async () => {
  const filterClient = await TransportVolunteerTable.aggregate([
    {
      $match: {
        status: "client",
      },
    },
  ]);

  return filterClient;
};

// single client get
const GetSingleTransportClientService = async (id: string) => {
  const filterClient = await TransportVolunteerTable.findById(id);

  if (!filterClient) {
    throw new ApiError(httpStatus.NOT_FOUND, "Client does not exists!");
  }

  return filterClient;
};

// update client
const UpdateSingleClientService = async (
  id: string,
  payload: Partial<ITransportVolunteer>
) => {
  const filterClient = await TransportVolunteerTable.findById(id);

  if (!filterClient) {
    throw new ApiError(httpStatus.NOT_FOUND, "Client does not exists!");
  }

  const update = await TransportVolunteerTable.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );

  return update;
};

export const ClientService = {
  GetAllClientService,
  GetSingleTransportClientService,
  UpdateSingleClientService,
};
