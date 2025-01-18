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
): Promise<ITransportVolunteer | null> => {
  const result = await TransportVolunteerTable.findById(id).populate(
    "meetings"
  );

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

export const TransportVolunteerService = {
  CreateTransportVolunteerService,
  GetAllTransportVolunteerService,
  GetSingleTransportVolunteerService,
  UpdateSingleTransportVolunteerService,
  GetAllTransportClientService,
  GetSingleTransportClientService,
  UpdateSingleClientController,
};
