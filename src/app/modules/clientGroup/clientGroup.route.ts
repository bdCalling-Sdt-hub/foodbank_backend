import express from "express";
import { ENUM_USER_ROLE } from "../../../enum/role";
import { AuthProvider } from "../../middleware/auth";
import { ClientController } from "./clientGroup.controller";

const router = express.Router();

router.post(
  "/create-client-group",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ClientController.CreateClientGroupController
);
router.get(
  "/",
  // AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ClientController.GetAllClientGroupController
);
router.get(
  "/driver-client",
  // AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ClientController.DriverClientGroupController
);

router.get(
  "/driver-modify-client",
  // AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ClientController.DriverClientGroupsModifyController
);


router.patch(
  "/:id",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ClientController.UpdateClientGroupController
);
router.get(
  "/:id",
  // AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ClientController.GetSingleClientGroupController
);
router.delete(
  "/:id",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ClientController.DeleteSingleClientGroupController
);



export const ClientGroupRoutes = router;
