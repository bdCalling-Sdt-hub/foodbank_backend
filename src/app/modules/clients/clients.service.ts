import httpStatus from "http-status";
import ApiError from "../../../error/APIsError";
import { IClient } from "./clients.interface";
import { ClientTable } from "./clients.model";

// Create/Add client service
const CreateClientService = async (payload: IClient): Promise<IClient> => {
  const result = await ClientTable.create(payload);
  return result;
};

// Get all client service
const GetAllClientService = async (): Promise<IClient[]> => {
  const result = await ClientTable.find({}).sort({ createdAt: -1 });
  return result;
};

// Get single client service
const GetSingleClientService = async (id: string): Promise<IClient | null> => {
  const result = await ClientTable.findById(id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid client");
  }

  return result;
};

// Update single client service
const UpdateSingleClientService = async (
  id: string,
  payload: Partial<IClient>
): Promise<Partial<IClient> | null> => {
  const result = await ClientTable.findById(id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid client");
  }

  const updateClient = await ClientTable.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );

  if (!updateClient) {
    throw new ApiError(httpStatus.NOT_FOUND, "Client does not exist!");
  }

  return updateClient;
};

export const ClientService = {
  CreateClientService,
  GetAllClientService,
  GetSingleClientService,
  UpdateSingleClientService,
};
