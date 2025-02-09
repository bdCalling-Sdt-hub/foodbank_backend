import express from "express";
import { ENUM_USER_ROLE } from "../../../enum/role";
import { AuthProvider } from "../../middleware/auth";
import { ClientController } from "./clients.controller";
const router = express.Router();

router.get(
  "/",
  // AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ClientController.GetAllClientsController
);
router.get(
  "/all",
  // AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ClientController.GetAllClientsModifyController
);

router.get(
  "/:id",
  // AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ClientController.GetSingleClientController
);

router.patch(
  "/:id",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ClientController.UpdateSingleClientController
);

router.delete(
  "/:id",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ClientController.DeleteSingleClientController
);

export const ClientRoutes = router;
