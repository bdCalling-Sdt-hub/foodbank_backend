import express from "express";
import { WarehouseController } from "./warehouse.controller";
const router = express.Router();

router.get("/", WarehouseController.GetAllWarehouseController);
router.get("/:id", WarehouseController.GetSingleWarehouseController);
router.patch("/:id", WarehouseController.UpdateSingleWarehouseController);
router.delete("/:id", WarehouseController.DeleteSingleWarehouseController);

export const WarehouseRoutes = router;
