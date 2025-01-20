import express from "express";
import { ENUM_USER_ROLE } from "../../../enum/role";
import { AuthProvider } from "../../middleware/auth";
import { DriverController } from "./drivers.controller";
const router = express.Router();

router.get(
  "/",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  DriverController.GetAllDeriverController
);
router.get(
  "/:id",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  DriverController.GetSingleDriverController
);
router.patch(
  "/:id",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  DriverController.UpdateSingleDriverController
);
router.delete(
  "/:id",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  DriverController.DeleteSingleDriverController
);

export const DriverRoutes = router;
