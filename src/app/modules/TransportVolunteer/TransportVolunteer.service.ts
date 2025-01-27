import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import ApiError from "../../../error/APIsError";
import { paginationHelper } from "../../../helper/paginationHelper";
import { IGenResponse } from "../../interfaces/Common";
import { IPaginationOptions } from "../../interfaces/interfaces";
import { TransportVolunteerSearchTermsFields } from "./TransportVolunteer.constant";
import {
  ITransportVolunteer,
  ITransportVolunteerFilters,
} from "./TransportVolunteer.interface";
import { TransportVolunteerTable } from "./TransportVolunteer.model";
import Events from "../events/events.model";

// Create transport volunteer service
const CreateTransportVolunteerService = async (
  payload: ITransportVolunteer
): Promise<ITransportVolunteer> => {
  const result = await TransportVolunteerTable.create(payload);
  return result;
};

// get all transport volunteer service
const GetAllTransportVolunteerService = async (
  filters: ITransportVolunteerFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenResponse<ITransportVolunteer[]>> => {
  const { searchTerm, ...searchTermData } = filters;

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: TransportVolunteerSearchTermsFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(searchTermData).length) {
    andConditions.push({
      $and: Object.entries(searchTermData).map(([fields, value]) => ({
        [fields]: value,
      })),
    });
  }

  // pagination sort
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.paginationCalculation(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions = andConditions.length ? { $and: andConditions } : {};
  const result = await TransportVolunteerTable.find(whereConditions)
    .populate("meetings")
    .sort(sortConditions)
    .limit(limit)
    .skip(skip);

  const total = await TransportVolunteerTable.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get single transport volunteer service
const GetSingleTransportVolunteerService = async (
  id: string
) => {
  const result = await TransportVolunteerTable.findById(id).populate(
    "meetings"
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid volunteer!");
  }

  const events = await Events.find({
    driver: { $elemMatch: { userId: id } },
  }).select("eventName eventType endOfEvent dayOfEvent endOfEvent location")

  return { result, events };
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

// ------------------CLIENT APIs endpoint------------------
const GetAllTransportClientService = async () => {
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
const UpdateSingleClientController = async (
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

// Delete volunteer
const DeleteSingleTransportVolunteerService = async (id: string) => {
  const filterClient = await TransportVolunteerTable.findById(id);

  if (!filterClient) {
    throw new ApiError(httpStatus.NOT_FOUND, "Client does not exists!");
  }

  const update = await TransportVolunteerTable.findByIdAndDelete(id, {
    new: true,
    runValidators: true,
  });

  return update;
};

// Get driver and warehouse
const GetAllDriverWarehouseTransportVolunteerService = async (
  filters: ITransportVolunteerFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenResponse<ITransportVolunteer[]>> => {
  const { searchTerm, ...searchTermData } = filters;

  const andConditions: any[] = [];

  // Add status filter for driver or warehouse
  andConditions.push({ status: { $in: ["driver", "warehouse"] } });

  // Add searchTerm filter for relevant fields
  if (searchTerm) {
    andConditions.push({
      $or: TransportVolunteerSearchTermsFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  // Add other filters based on searchTermData
  if (Object.keys(searchTermData).length) {
    andConditions.push({
      $and: Object.entries(searchTermData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // Pagination and sorting
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.paginationCalculation(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // Where conditions to pass to find method
  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  // Query the transport volunteer table with conditions, sorting, and pagination
  const result = await TransportVolunteerTable.find(whereConditions)
    .populate("meetings")
    .sort(sortConditions)
    .limit(limit)
    .skip(skip);

  // Count the total number of documents matching the conditions
  const total = await TransportVolunteerTable.countDocuments(whereConditions);

  // Return the paginated response
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const TransportVolunteerService = {
  CreateTransportVolunteerService,
  GetAllTransportVolunteerService,
  GetSingleTransportVolunteerService,
  UpdateSingleTransportVolunteerService,
  GetAllTransportClientService,
  GetSingleTransportClientService,
  UpdateSingleClientController,
  DeleteSingleTransportVolunteerService,
  GetAllDriverWarehouseTransportVolunteerService,
};
