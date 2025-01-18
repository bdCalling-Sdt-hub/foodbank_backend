import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import ApiError from "../../../error/APIsError";
import { paginationHelper } from "../../../helper/paginationHelper";
import { IGenResponse } from "../../interfaces/Common";
import { IPaginationOptions } from "../../interfaces/interfaces";
import { TransportVolunteerTable } from "../TransportVolunteer/TransportVolunteer.model";
import { IClientGroup, IClientGroupFilters } from "./clientGroup.interface";
import { ClientGroupTable } from "./clientGroup.model";

// client group service
const CreateClientGroupService = async (
  payload: IClientGroup
): Promise<IClientGroup> => {
  // console.log(payload);
  const meetings = await ClientGroupTable.create(payload);

  // Add this meeting to each client's `meetings` field
  await TransportVolunteerTable.updateMany(
    { _id: { $in: payload.clients } },
    { $push: { meetings: meetings._id } }
  );

  return meetings;
};

// client group service
const GetAllClientGroupService = async (
  filters: IClientGroupFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenResponse<IClientGroup[]>> => {
  const { searchTerm, ...searchTermData } = filters;

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: ["clientGroupName"].map((field) => ({
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
  const result = await ClientGroupTable.find(whereConditions)
    .populate("clients")
    .sort(sortConditions)
    .limit(limit)
    .skip(skip);

  const total = await ClientGroupTable.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
//single client group service
const GetSingleClientGroupService = async (
  id: string
): Promise<IClientGroup | null> => {
  const result = await ClientGroupTable.findById(id).populate("clients");
  return result;
};

// update client group service
const UpdateClientGroupService = async (
  id: string,
  payload: Partial<IClientGroup>
): Promise<Partial<IClientGroup | null>> => {
  const isExist = await ClientGroupTable.findById(id).populate("clients");

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Group does not exist!");
  }

  const result = await ClientGroupTable.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  ).populate("clients");

  return result;
};

export const ClientGroupService = {
  CreateClientGroupService,
  GetAllClientGroupService,
  UpdateClientGroupService,
  GetSingleClientGroupService,
};
