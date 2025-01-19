import express from "express";
import { loginController } from "./auth.controller";

const router = express.Router();

router.post("/login", loginController.loginUser);
router.post("/create-refresh-token", loginController.refreshToken);
router.post("/change-password", loginController.changePassword);
router.post("/forgot-password", loginController.forgotPassword);
router.post("/reset-password", loginController.resetPassword);
router.post("/resend-otp", loginController.resendOTPController);
router.post("/check-otp", loginController.checkOTPController);

export const AuthRoutes = router;
