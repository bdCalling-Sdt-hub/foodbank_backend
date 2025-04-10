import express from "express";
import { ENUM_USER_ROLE } from "../../../enum/role";
import { AuthProvider } from "../../middleware/auth";
import { EventController } from "./events.controller";
const router = express.Router();

router
  .post(
    "/create",
    // AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.createEventsDb
  )
  .get(
    "/get-all",
    // AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.getEvents
  )
  .get(
    "/get/:eventId",
    // AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
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
    // AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.addClients
  )
  .patch(
    "/accept-request",
    // AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.acceptRequest
  )
  .patch(
    "/cancel-request",
    // AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.cancelRequest
  )
  .patch(
    "/add-groups",
    // AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.addGroupUpdate
  )
  .patch(
    "/remove-groups",
    // AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
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
  )
  .get(
    "/get-events-driver",
    // AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.getEventDrivers
  )
  // =====================Processing=================
  .patch(
    "/assigned-clients",
    AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.assignedClients
  )

  .get(
    "/volunteer-details/:id",
    AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.volunteerDetails
  )
  // =====================================
  // .get(
  //   "/get-event-client/:eventId",
  //   AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  //   EventController.getEventClients
  // )
  .patch(
    "/confirmed-clients-status",
    AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.confirmedClientsStatusUpdate
  )
  .get(
    "/get_assigned_clients_for_event",
    // AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    EventController.getAssignedClientsForEvent
  )


export const EventRouters = router;
