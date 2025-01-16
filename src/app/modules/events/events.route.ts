import express from "express";
import { ENUM_USER_ROLE } from "../../../enum/role";
import { AuthProvider } from "../../middleware/auth";
import { EventController } from "./events.controller";
const router = express.Router();

router.post(
  "/create",
  //   AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN),
  EventController.createEventsDb
)
  .get(
    "/get-all",
    // AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN),
    EventController.getEvents
  )
  .get(
    "/get/:eventId",
    //   AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN),
    EventController.getEvent
  )
  .patch(
    "/update/:eventId",
    //   AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN),
    EventController.updateEvent
  )
  .delete(
    "/delete/:eventId",
    //   AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN),
    EventController.deleteEvent
  )
  .patch(
    "/add-clients",
    //   AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN),
    EventController.addClients
  )

  .patch(
    "/remove-clients",
    //   AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN),
    EventController.removeClientByEmail
  )



export const EventRouters = router;
