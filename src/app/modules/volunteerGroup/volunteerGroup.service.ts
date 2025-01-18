import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import ApiError from "../../../error/APIsError";
import { paginationHelper } from "../../../helper/paginationHelper";
import { IGenResponse } from "../../interfaces/Common";
import { IPaginationOptions } from "../../interfaces/interfaces";
import { IVolunteerFilters, IVolunteerGroup } from "./volunteerGroup.interface";
import { VolunteerGroupT } from "./volunteerGroup.model";

const CreateVolunteerGroupService = async (
  payload: IVolunteerGroup
): Promise<IVolunteerGroup | null> => {
  const result = await VolunteerGroupT.create(payload);

  // Add this meeting to each client's `meetings` field
  const data = await VolunteerGroupT.updateMany(
    { _id: { $in: payload.volunteers } },
    { $push: { volunteers: result._id } }
  );

  console.log(data);

  return result;
};

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

const UpdateVolunteerGroupService = async (
  id: string,
  payload: Partial<IVolunteerGroup>
): Promise<IVolunteerGroup | null> => {
  const isExist = await VolunteerGroupT.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Group does not exists!");
  }

  const result = await VolunteerGroupT.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );
  return result;
};

const GetSingleVolunteerGroupService = async (
  id: string
): Promise<IVolunteerGroup | null> => {
  const isExist = await VolunteerGroupT.findById(id).populate("volunteers");
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Group does not exists!");
  }

  return isExist;
};

export const VolunteerGroupService = {
  CreateVolunteerGroupService,
  GetAllVolunteerGroupService,
  UpdateVolunteerGroupService,
  GetSingleVolunteerGroupService,
};
