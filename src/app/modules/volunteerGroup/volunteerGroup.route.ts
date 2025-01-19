import express from "express";
import { VolunteerGroupController } from "./volunteerGroup.controller";
const router = express.Router();

router.post(
  "/create-volunteer-group",
  VolunteerGroupController.CreateVolunteerGroupController
);
router.get("/", VolunteerGroupController.GetAllVolunteerGroupController);
router.get("/:id", VolunteerGroupController.GetSingleVolunteerGroupController);
router.patch("/:id", VolunteerGroupController.UpdateVolunteerGroupController);
router.delete("/:id", VolunteerGroupController.DeleteVolunteerGroupController);

export const VolunteerGroupRoutes = router;
