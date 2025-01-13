import express from "express";
import { loginController } from "./auth.controller";

const router = express.Router();

router.post("/login", loginController.loginUser);
router.post("/create-refresh-token", loginController.refreshToken);
router.post("/change-password", loginController.changePassword);

export const AuthRoutes = router;
