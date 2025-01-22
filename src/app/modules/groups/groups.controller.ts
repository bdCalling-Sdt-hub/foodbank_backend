import { Request, Response } from "express";
import httpStatus from "http-status";
import CatchAsync from "../../../shared/CatchAsync";
import SendResponse from "../../../shared/SendResponse";
import { IGroups } from "./groups.interface";
import { GroupsService } from "./groups.service";

// Create groups
const CreateGroupsController = CatchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await GroupsService.GetAllGroupsService(payload);

    SendResponse<IGroups>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Group create success",
      data: result,
    });
  }
);

export const GroupsController = {
  CreateGroupsController,
};
