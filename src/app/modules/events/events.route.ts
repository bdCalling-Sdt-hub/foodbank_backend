import express from "express";
import { ENUM_USER_ROLE } from "../../../enum/role";
import { AuthProvider } from "../../middleware/auth";
import { EventController } from "./events.controller";
const router = express.Router();

router
  .post(
    "/create",
    AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.createEventsDb
  )
  .get(
    "/get-all",
    AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.getEvents
  )
  .get(
    "/get/:eventId",
    AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.getEvent
  )
  .patch(
    "/update/:eventId",
    AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.updateEvent
  )
  .delete(
    "/delete/:eventId",
    AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.deleteEvent
  )
  .patch(
    "/add-clients",
    AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.addClients
  )
  .patch(
    "/add-groups",
    AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.addGroupUpdate
  )
  .patch(
    "/remove-groups",
    AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.removeGroupUpdate
  )
  .patch(
    "/remove-clients",
    AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.removeClientByEmail
  )
  .get(
    "/get-groups",
    AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.getEventsGroups
  );

export const EventRouters = router;
