import httpStatus from "http-status";
import mongoose, { SortOrder, Types } from "mongoose";
import ApiError from "../../../error/APIsError";
import { paginationHelper } from "../../../helper/paginationHelper";
import { IGenResponse } from "../../interfaces/Common";
import { IPaginationOptions } from "../../interfaces/interfaces";
import { IGroups } from "../groups/groups.interface";
import { Groups } from "../groups/groups.model";
import { IVolunteerFilters, IVolunteerGroup } from "./volunteerGroup.interface";
import { VolunteerGroupT } from "./volunteerGroup.model";

// Create/add a volunteer group
const CreateVolunteerGroupService = async (
  payload: IVolunteerGroup
): Promise<IVolunteerGroup | null> => {
  const result = await VolunteerGroupT.create(payload);

  // Add this meeting to each client's `meetings` field
  const data = await VolunteerGroupT.updateMany(
    { _id: { $in: payload.volunteers } },
    { $push: { volunteers: result._id } }
  );

  // console.log(result);

  return result;
};

// Get all volunteer group
const GetAllVolunteerGroupService = async (
  filters: IVolunteerFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenResponse<IVolunteerGroup[]>> => {
  const { searchTerm, ...searchTermData } = filters;

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: ["volunteerGroupName", "volunteerType"].map((field) => ({
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
  const result = await VolunteerGroupT.find(whereConditions)
    .populate("volunteers")
    .sort(sortConditions)
    .limit(limit)
    .skip(skip);

  const total = await VolunteerGroupT.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// update
const UpdateVolunteerGroupService = async (
  id: string,
  payload: Partial<IVolunteerGroup>
): Promise<IVolunteerGroup | null> => {
  const isExist = await VolunteerGroupT.findById(id).populate("volunteers");
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Group does not exists!");
  }

  console.log("payload", payload)

  const result = await VolunteerGroupT.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  ).populate("volunteers");
  console.log("result", result)
  return result;
};

const GetSingleVolunteerGroupService = async (
  id: string,
  search: string = "",
  page: number = 1,
  limit: number = 10
): Promise<{ result: IGroups | null; total: number; totalPages: number }> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid group ID");
  }

  const skip = (page - 1) * limit;

  const searchQuery = search
    ? {
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const result = await Groups.findById(id)
    .populate({
      path: "clients",
      select:
        "firstName lastName phoneNo address zipCode badgeNumber email volunteerRole city volunteerType",
      match: searchQuery,
      options: { skip, limit },
    })
    .exec();

  const totalClients = await Groups.findById(id)
    .populate({
      path: "clients",
      match: searchQuery,
    })
    .exec();

  const total = totalClients?.clients.length || 0;
  const totalPages = Math.ceil(total / limit);
  // @ts-ignore
  return { result, total: totalPages, page, limit };
};

// Delete volunteer group
const DeleteSingleVolunteerGroupService = async (
  id: string
): Promise<IVolunteerGroup | null> => {
  // Check if the group id is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid group ID");
  }

  const isExist = await VolunteerGroupT.findById(id).populate("volunteers");

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Group does not exist!");
  }

  const result = await VolunteerGroupT.findByIdAndDelete(id, {
    new: true,
    runValidators: true,
  }).populate("volunteers");

  return result;
};

export const VolunteerGroupService = {
  CreateVolunteerGroupService,
  GetAllVolunteerGroupService,
  UpdateVolunteerGroupService,
  GetSingleVolunteerGroupService,
  DeleteSingleVolunteerGroupService,
};
