import httpStatus from "http-status";
import mongoose, { SortOrder, Types } from "mongoose";
import ApiError from "../../../error/APIsError";
import { paginationHelper } from "../../../helper/paginationHelper";
import { IGenResponse } from "../../interfaces/Common";
import { IPaginationOptions } from "../../interfaces/interfaces";
import { IGroups } from "../groups/groups.interface";
import { Groups } from "../groups/groups.model";
import { IClientGroupFilters } from "./clientGroup.interface";
import { TransportVolunteerTable } from "../TransportVolunteer/TransportVolunteer.model";

// client group service
const CreateClientGroupService = async (payload: IGroups): Promise<IGroups> => {
  const { clients } = payload;

  const meetings = await Groups.create(payload);
  if (!meetings) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to create client group");
  }
  const meetingId = meetings._id


  await TransportVolunteerTable.updateMany(
    { _id: { $in: clients } },
    { $push: { meetings: meetingId } }
  );
  return meetings;
};

// client group service
const GetAllClientGroupService = async (
  filters: IClientGroupFilters,
  paginationOptions: IPaginationOptions,
  types: string,
): Promise<IGenResponse<IGroups[]>> => {
  const { searchTerm, ...searchTermData } = filters;

  console.log("Filters:", filters);

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: [{ groupName: { $regex: searchTerm, $options: "i" } }],
    });
  }

  if (Object.keys(searchTermData).length) {
    andConditions.push({
      $and: Object.entries(searchTermData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions: any = { types };

  if (andConditions.length) {
    whereConditions.$and = andConditions;
  }

  // Pagination and sorting
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.paginationCalculation(paginationOptions);

  const sortConditions: any = [];

  // @ts-ignore
  if (sortOrder === "name") {
    sortConditions.push({ $sort: { lowerGroupName: 1 } });
  } else if (sortBy && sortOrder) {
    sortConditions.push({ $sort: { [sortBy]: sortOrder } });
  }

  // MongoDB Aggregation Pipeline
  const result = await Groups.aggregate([
    { $match: whereConditions },
    {
      $addFields: {
        lowerGroupName: { $toLower: "$groupName" }, // ✅ Convert to lowercase for sorting
      },
    },
    ...sortConditions,
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "clients", // Ensure this matches your clients collection
        localField: "clients",
        foreignField: "_id",
        as: "clients",
      },
    },
  ]);

  const total = await Groups.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};


const GetAllClientGroupModifyService = async (
  filters: IClientGroupFilters,
  paginationOptions: IPaginationOptions,
  types: string,
): Promise<IGenResponse<IGroups[]>> => {
  const { searchTerm, ...searchTermData } = filters;

  console.log('=====================', filters)


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

  // @ts-ignore
  if (sortOrder === 'name') {
    console.log("=========", sortOrder)
    sortConditions["groupName"] = 1;
  } else if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions = andConditions.length
    ? { $and: andConditions, types }
    : { types };
  const result = await Groups.find(whereConditions)
    .populate("clients")
    .sort(sortConditions)

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

  console.log("types=-===========", searchTermData);

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
const DriverClientGroupsModifyService = async (
  filters: IClientGroupFilters,
  paginationOptions: IPaginationOptions,
  types: string = "driver,warehouse"
): Promise<IGenResponse<IGroups[]>> => {
  //@ts-ignore
  const { searchTerm, volunteerType, ...searchTermData } = filters;

  console.log("Filters:", volunteerType);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: [{ groupName: { $regex: searchTerm, $options: "i" } }],
    });
  }

  if (Object.keys(searchTermData).length) {
    andConditions.push({
      $and: Object.entries(searchTermData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const typeArray = types ? types.split(",") : ["driver", "warehouse"];

  const whereConditions: any = { types: { $in: typeArray } };

  if (volunteerType) {
    whereConditions.types = volunteerType;
  }

  if (andConditions.length) {
    whereConditions.$and = andConditions;
  }

  // Pagination and sorting
  const { page, limit, skip, sortBy = "createdAt", sortOrder = "desc" } =
    paginationHelper.paginationCalculation(paginationOptions);

  const sortConditions: any = [];
  // @ts-ignore
  if (sortOrder === "name") {
    sortConditions.push({ $sort: { lowerGroupName: 1 } });
  } else {
    sortConditions.push({ $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 } });
  }

  // MongoDB Aggregation Pipeline
  const result = await Groups.aggregate([
    { $match: whereConditions },
    {
      $addFields: {
        lowerGroupName: { $toLower: "$groupName" }, // Convert to lowercase
      },
    },
    ...sortConditions,
    { $skip: skip },
    { $limit: Number(limit) },
    {
      $lookup: {
        from: "clients", // Ensure this matches your clients collection name
        localField: "clients",
        foreignField: "_id",
        as: "clients",
      },
    },
  ]);

  const total = await Groups.countDocuments(whereConditions);

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
  id: string,
  search: string = "",
  page: number = 1,
  limit: number = 10
): Promise<IGroups | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid group ID");
  }

  const skip = (page - 1) * limit;
  const searchQuery = search
    ? { $or: [{ firstName: { $regex: search, $options: "i" } }, { lastName: { $regex: search, $options: "i" } }] }
    : {};

  // Retrieve the group with filtered clients
  const result = await Groups.findById(id)
    .populate({
      path: "clients",
      select: "firstName lastName phoneNo address zipCode badgeNumber alternativePhoneNo city",
      match: searchQuery,
      options: {
        skip,
        limit,
      },
    })
    .exec();

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Group does not exist!");
  }

  // Calculate the total number of matched clients
  const totalClients = await TransportVolunteerTable.countDocuments({
    _id: { $in: result.clients },
    ...searchQuery,
  });

  const groups = await Groups.findById(id) as IGroups;

  // Calculate total pages
  const total = groups?.clients?.length;

  console.log("Total pages: ", total)

  console.log(totalClients,
    total,
    page,
    limit,);

  return {
    // @ts-ignore
    result,
    meta: {
      totalClients,
      total,
      page,
      limit,
    },
  };
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

  // Extract the previous and new clients
  const previousClients = isExist.clients.map((client: any) => client._id.toString());
  const newClients = payload.clients ? payload.clients.map((client: any) => client.toString()) : [];

  // Find clients to be removed and added
  const clientsToRemove = previousClients.filter(client => !newClients.includes(client));
  const clientsToAdd = newClients.filter(client => !previousClients.includes(client));

  // Update the Group first
  const updatedGroup = await Groups.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  ).populate("clients");

  // Remove this meeting ID from old clients
  if (clientsToRemove.length > 0) {
    await TransportVolunteerTable.updateMany(
      { _id: { $in: clientsToRemove } },
      { $pull: { meetings: id } }
    );
  }

  // Add this meeting ID to new clients
  if (clientsToAdd.length > 0) {
    await TransportVolunteerTable.updateMany(
      { _id: { $in: clientsToAdd } },
      { $push: { meetings: id } }
    );
  }

  return updatedGroup;
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
  DriverClientGroupsModifyService,
  GetAllClientGroupModifyService
};
