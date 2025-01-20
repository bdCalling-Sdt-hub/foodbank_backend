import express from "express";
import { ENUM_USER_ROLE } from "../../../enum/role";
import { AuthProvider } from "../../middleware/auth";
import { VolunteerGroupController } from "./volunteerGroup.controller";
const router = express.Router();

router.post(
  "/create-volunteer-group",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  VolunteerGroupController.CreateVolunteerGroupController
);
router.get(
  "/",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  VolunteerGroupController.GetAllVolunteerGroupController
);
router.get(
  "/:id",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  VolunteerGroupController.GetSingleVolunteerGroupController
);
router.patch(
  "/:id",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  VolunteerGroupController.UpdateVolunteerGroupController
);
router.delete(
  "/:id",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  VolunteerGroupController.DeleteVolunteerGroupController
);

export const VolunteerGroupRoutes = router;
