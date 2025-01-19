import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constant/constant";
import CatchAsync from "../../../shared/CatchAsync";
import pick from "../../../shared/pick";
import SendResponse from "../../../shared/SendResponse";
import { IVolunteerGroup } from "./volunteerGroup.interface";
import { VolunteerGroupService } from "./volunteerGroup.service";

// add a new group
const CreateVolunteerGroupController = CatchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await VolunteerGroupService.CreateVolunteerGroupService(
      payload
    );

    SendResponse<IVolunteerGroup>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Volunteer group added success!",
      data: result,
    });
  }
);

// get all group
const GetAllVolunteerGroupController = CatchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, [
      "searchTerm",
      "volunteerGroupName",
      "volunteerType",
    ]);

    const paginationOptions = pick(req.query, paginationFields);

    const result = await VolunteerGroupService.GetAllVolunteerGroupService(
      // @ts-ignore
      filters,
      paginationOptions
    );

    SendResponse<IVolunteerGroup[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Volunteer group get success!",
      meta: result.meta,
      data: result.data,
    });
  }
);
// update volunteer group
const UpdateVolunteerGroupController = CatchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const { id } = req.params;
    const result = await VolunteerGroupService.UpdateVolunteerGroupService(
      id,
      payload
    );

    SendResponse<IVolunteerGroup>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Volunteer group updated success!",
      data: result,
    });
  }
);
// get single volunteer group
const GetSingleVolunteerGroupController = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await VolunteerGroupService.GetSingleVolunteerGroupService(
      id
    );

    SendResponse<IVolunteerGroup>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Single volunteer group get success!",
      data: result,
    });
  }
);

// Delete volunteer group
const DeleteVolunteerGroupController = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await VolunteerGroupService.DeleteSingleVolunteerGroupService(id);

    SendResponse<IVolunteerGroup>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Deleted volunteer group!",
      data: result,
    });
  }
);

export const VolunteerGroupController = {
  CreateVolunteerGroupController,
  GetAllVolunteerGroupController,
  UpdateVolunteerGroupController,
  GetSingleVolunteerGroupController,
  DeleteVolunteerGroupController,
};
