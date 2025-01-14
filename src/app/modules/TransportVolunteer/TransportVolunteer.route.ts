import express from "express";
import { TransportVolunteerController } from "./TransportVolunteer.controller";
const router = express.Router();

router.post(
  "/create-transport-volunteer",
  TransportVolunteerController.CreateTransportVolunteerController
);

export const TransportVolunteerRoutes = router;
