import express from "express";
import { UserController } from "./user.controller";
const router = express.Router();

router.post(
  "/create-user",
  // AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.CreateUserController
);

export const UserRouters = router;
