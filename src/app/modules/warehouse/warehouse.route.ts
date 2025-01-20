import express from "express";
import { ENUM_USER_ROLE } from "../../../enum/role";
import { AuthProvider } from "../../middleware/auth";
import { WarehouseController } from "./warehouse.controller";
const router = express.Router();

router.get(
  "/",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  WarehouseController.GetAllWarehouseController
);
router.get(
  "/:id",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  WarehouseController.GetSingleWarehouseController
);
router.patch(
  "/:id",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  WarehouseController.UpdateSingleWarehouseController
);
router.delete(
  "/:id",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  WarehouseController.DeleteSingleWarehouseController
);

export const WarehouseRoutes = router;
