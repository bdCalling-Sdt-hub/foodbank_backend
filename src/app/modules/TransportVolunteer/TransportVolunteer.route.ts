import express from "express";
import { ENUM_USER_ROLE } from "../../../enum/role";
import { AuthProvider } from "../../middleware/auth";
import { TransportVolunteerController } from "./TransportVolunteer.controller";
const router = express.Router();

router.post(
  "/create-transport-volunteer",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  TransportVolunteerController.CreateTransportVolunteerController
);

router.get(
  "/",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  TransportVolunteerController.GetAllTransportVolunteerController
);

router.get(
  "/:id",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  TransportVolunteerController.GetSingleTransportVolunteerController
);
router.patch(
  "/:id",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  TransportVolunteerController.UpdateSingleTransportVolunteerController
);

export const TransportVolunteerRoutes = router;
