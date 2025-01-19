import express from "express";
import { ClientController } from "./clients.controller";
const router = express.Router();

router.get("/", ClientController.GetAllClientsController);
router.get("/:id", ClientController.GetSingleClientController);
router.patch("/:id", ClientController.UpdateSingleClientController);
router.delete("/:id", ClientController.DeleteSingleClientController);

export const ClientRoutes = router;
