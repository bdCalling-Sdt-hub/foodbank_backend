import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import ApiError from "../../../error/APIsError";
import { paginationHelper } from "../../../helper/paginationHelper";
import { IGenResponse } from "../../interfaces/Common";
import { IPaginationOptions } from "../../interfaces/interfaces";
import { ClientGroupTable } from "../clientGroup/clientGroup.model";
import { KeyOfFilterForClientSearchTerm } from "../clients/clients.constant";
import { IClientFilterKey } from "../clients/clients.interface";
import { ITransportVolunteer } from "../TransportVolunteer/TransportVolunteer.interface";
import { TransportVolunteerTable } from "../TransportVolunteer/TransportVolunteer.model";
import { VolunteerGroupT } from "../volunteerGroup/volunteerGroup.model";

const GetAllDriverService = async (
  filters: IClientFilterKey,
  paginationOptions: IPaginationOptions
): Promise<IGenResponse<ITransportVolunteer[]>> => {
  const { searchTerm, status, ...searchTermData } = filters;

  const andConditions = [];

  // Add status filter
  andConditions.push({ status: "driver" });

  if (searchTerm) {
    andConditions.push({
      $or: KeyOfFilterForClientSearchTerm.map((field) => ({
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
    // .populate("volunteers")
    .sort(sortConditions)
    .limit(limit)
    .skip(skip);

  // Get total count of clients
  const total = await TransportVolunteerTable.countDocuments({
    status: "driver",
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get single driver
const GetSingleDriverService = async (
  id: string
): Promise<Partial<ITransportVolunteer>> => {
  const driver = await TransportVolunteerTable.findById(id).populate(
    "meetings"
  );

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

// delete single drive
const DeleteSingleDriverService = async (
  id: string
): Promise<Partial<ITransportVolunteer | null>> => {
  const driver = await TransportVolunteerTable.findById(id);

  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, "Driver does not exists!");
  }

  const isIncludeClientGroup = await ClientGroupTable.findOne({
    clients: { _id: id },
  });
  const isIncludeVolunteerGroup = await VolunteerGroupT.findOne({
    volunteers: { _id: id },
  });

  // console.log({ isIncludeClientGroup, isIncludeVolunteerGroup });

  if (isIncludeClientGroup || isIncludeVolunteerGroup) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "The volunteer already attended the meeting."
    );
  }

  const update = await TransportVolunteerTable.findByIdAndDelete(id, {
    new: true,
    runValidators: true,
  });

  return update;
};

export const DriverService = {
  GetAllDriverService,
  GetSingleDriverService,
  UpdateSingleDriverService,
  DeleteSingleDriverService,
};
