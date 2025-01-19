import express from "express";
import { ClientController } from "./clientGroup.controller";

const router = express.Router();

router.post(
  "/create-client-group",
  ClientController.CreateClientGroupController
);
router.get("/", ClientController.GetAllClientGroupController);
router.patch("/:id", ClientController.UpdateClientGroupController);
router.get("/:id", ClientController.GetSingleClientGroupController);
router.delete("/:id", ClientController.DeleteSingleClientGroupController);

export const ClientGroupRoutes = router;
