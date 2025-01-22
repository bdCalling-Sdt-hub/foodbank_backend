import express from "express";
import { ENUM_USER_ROLE } from "../../../enum/role";
import { AuthProvider } from "../../middleware/auth";
import { GroupsController } from "./groups.controller";
const router = express.Router();

router.post(
  "/create-group",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  GroupsController.CreateGroupsController
);

export const GroupRoutes = router;
