import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import ApiError from "../../../error/APIsError";
import { paginationHelper } from "../../../helper/paginationHelper";
import { IPaginationOptions } from "../../interfaces/interfaces";
import { ITransportVolunteer } from "../TransportVolunteer/TransportVolunteer.interface";
import { TransportVolunteerTable } from "../TransportVolunteer/TransportVolunteer.model";
import { ClientGroupTable } from "../clientGroup/clientGroup.model";
import { KeyOfFilterForClientSearchTerm } from "../clients/clients.constant";
import { IClientFilterKey } from "../clients/clients.interface";
import { VolunteerGroupT } from "../volunteerGroup/volunteerGroup.model";
import Events from "../events/events.model";

const GetAllWarehouseService = async (
  filters: IClientFilterKey,
  paginationOptions: IPaginationOptions
) => {
  const { searchTerm, status, ...searchTermData } = filters;

  const andConditions = [];

  // Add status filter
  andConditions.push({ status: "warehouse" });

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

  // @ts-ignore
  if (sortOrder === 'name') {
    sortConditions["firstName"] = 1;
    // @ts-ignore
  } else if (sortOrder === "vip") {
    sortConditions["volunteerType"] = -1;
  } else if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions = andConditions.length ? { $and: andConditions } : {};
  const result = await TransportVolunteerTable.find(whereConditions)
    .populate("meetings")
    .sort(sortConditions)
    .limit(limit)
    .skip(skip);

  // Get total count of clients
  const total = await TransportVolunteerTable.countDocuments({
    status: "warehouse",
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

// get single Warehouse
const GetSingleWarehouseService = async (
  id: string
) => {
  const warehouse = await TransportVolunteerTable.findById(id).populate(
    "meetings"
  );

  if (!warehouse) {
    throw new ApiError(httpStatus.NOT_FOUND, "Client does not exists!");
  }

  const events = await Events.find({
    warehouse: { $elemMatch: { userId: id } },
  }).select("eventName eventType endOfEvent dayOfEvent endOfEvent location")

  return { warehouse, events };
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
// delete single drive
const DeleteSingleWarehouseService = async (
  id: string
): Promise<Partial<ITransportVolunteer | null>> => {
  const warehouse = await TransportVolunteerTable.findById(id);

  if (!warehouse) {
    throw new ApiError(httpStatus.NOT_FOUND, "Warehouse does not exists!");
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

export const WarehouseService = {
  GetAllWarehouseService,
  GetSingleWarehouseService,
  UpdateSingleWarehouseService,
  DeleteSingleWarehouseService,
};
