import httpStatus from "http-status";
import mongoose, { SortOrder } from "mongoose";
import ApiError from "../../../error/APIsError";
import { paginationHelper } from "../../../helper/paginationHelper";
import { IGenResponse } from "../../interfaces/Common";
import { IPaginationOptions } from "../../interfaces/interfaces";
import { IGroups } from "../groups/groups.interface";
import { Groups } from "../groups/groups.model";
import { IClientGroupFilters } from "./clientGroup.interface";

// client group service
const CreateClientGroupService = async (payload: IGroups): Promise<IGroups> => {
  // console.log(payload);
  const meetings = await Groups.create(payload);

  return meetings;
};

// client group service
const GetAllClientGroupService = async (
  filters: IClientGroupFilters,
  paginationOptions: IPaginationOptions,
  types: string
): Promise<IGenResponse<IGroups[]>> => {
  const { searchTerm, ...searchTermData } = filters;

  console.log("types", types);

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: ["groupName"].map((field) => ({
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
  const whereConditions = andConditions.length
    ? { $and: andConditions, types }
    : { types };
  const result = await Groups.find(whereConditions)
    .populate("clients")
    .sort(sortConditions)
    .limit(limit)
    .skip(skip);

  const total = await Groups.countDocuments({ types });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const DriverClientGroupService = async (
  filters: IClientGroupFilters,
  paginationOptions: IPaginationOptions,
  types: string
): Promise<IGenResponse<IGroups[]>> => {
  const { searchTerm, ...searchTermData } = filters;

  console.log("types=-===========");

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: ["groupName"].map((field) => ({
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
  const whereConditions = andConditions.length
    ? { $and: andConditions, types: ["driver", "warehouse"] }
    : { types: ["driver", "warehouse"] };
  const result = await Groups.find(whereConditions)
    .populate("clients")
    .sort(sortConditions)
    .limit(limit)
    .skip(skip);

  const total = await Groups.countDocuments({ types: ["driver", "warehouse"] });

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
): Promise<IGroups | null> => {
  const result = await Groups.findById(id).populate("clients");
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Group does not exist!");
  }
  return result;
};

// update client group service
const UpdateClientGroupService = async (
  id: string,
  payload: Partial<IGroups>
): Promise<Partial<IGroups | null>> => {
  const isExist = await Groups.findById(id).populate("clients");

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Group does not exist!");
  }

  console.log("=========", payload);

  const result = await Groups.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  ).populate("clients");

  return result;
};

// delete client group service
const DeleteClientGroupService = async (
  id: string
): Promise<Partial<IGroups | null>> => {
  // Check if the meetingId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid meeting ID");
  }

  const isExist = await Groups.findById(id).populate("clients");

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Group does not exist!");
  }

  const result = await Groups.findByIdAndDelete(id, {
    new: true,
    runValidators: true,
  }).populate("clients");

  return result;
};

export const ClientGroupService = {
  CreateClientGroupService,
  GetAllClientGroupService,
  UpdateClientGroupService,
  GetSingleClientGroupService,
  DeleteClientGroupService,
  DriverClientGroupService,
};
