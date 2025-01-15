import express from "express";
import { ENUM_USER_ROLE } from "../../../enum/role";
import { AuthProvider } from "../../middleware/auth";
import { UserController } from "./user.controller";
const router = express.Router();

router.post(
  "/create-user",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.CreateUserController
);

router.get(
  "/",
  // AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.GetAllUserController
);
router.get("/:id", UserController.GetSingleUserController);

router.patch(
  "/:id",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.UpdateUserController
);

router.delete(
  "/:id",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.DeleteUserController
);

export const UserRouters = router;
