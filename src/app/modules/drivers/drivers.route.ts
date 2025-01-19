import express from "express";
import { DriverController } from "./drivers.controller";
const router = express.Router();

router.get("/", DriverController.GetAllDeriverController);
router.get("/:id", DriverController.GetSingleDriverController);
router.patch("/:id", DriverController.UpdateSingleDriverController);
router.delete("/:id", DriverController.DeleteSingleDriverController);

export const DriverRoutes = router;
