import express from "express";
import { ClientController } from "./clients.controller";
const router = express.Router();

router.get("/", ClientController.GetAllClientsController);
router.get("/:id", ClientController.GetSingleClientController);
router.patch("/:id", ClientController.UpdateSingleClientController);

export const ClientRoutes = router;
