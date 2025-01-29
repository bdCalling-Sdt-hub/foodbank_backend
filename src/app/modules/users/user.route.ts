import express, { NextFunction, Request, Response } from "express";
import { ENUM_USER_ROLE } from "../../../enum/role";
import { FileUploads } from "../../../helper/fileUploads";
import { AuthProvider } from "../../middleware/auth";
import { UserController } from "./user.controller";
const router = express.Router();

router.post(
  "/create-user",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FileUploads.uploads.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    return UserController.CreateUserController(req, res, next);
  }
);

// UserController.CreateUserController

router.get(
  "/",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.GetAllUserController
);

router.get(
  "/super-admin",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.SuperAdminUserController
);

router.get(
  "/:id",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.GetSingleUserController
);

router.patch(
  "/:id",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FileUploads.uploads.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      let updateData: any = req.body;
      console.log("Parsed Update Data:", req?.file);
      if (updateData) {
        updateData =
          typeof updateData === "string" ? JSON.parse(updateData) : updateData;
      }

      const file = req?.file;


      if (file) {
        updateData.profilePicture = file.path;
      }



      const updatedUser = await UserController.UpdateUserController(
        id,
        updateData,
        res
      );

      // Send a success response with the updated user data
      res.status(200).json({
        success: true,
        message: "User updated successfully!",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
);

// router.patch(
//   "/:id",
//   AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
//   UserController.UpdateUserController
// );

router.delete(
  "/:id",
  AuthProvider.Auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.DeleteUserController
);

export const UserRouters = router;
