import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";
import Config from "../../../config/Config";
import { IUser, UserModel } from "./user.interface";

const userSchema = new Schema<IUser, UserModel>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    contactNo: {
      type: String,
      unique: true,
      // required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      // required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      // select: false,
    },

    profilePicture: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
    },
    resetOTP: {
      type: String,
    },
    otpExpiry: {
      type: Number,
    },
    isCheckOTP: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// email match
userSchema.methods.isEmailExist = async function (
  email: string
): Promise<Partial<IUser> | null> {
  const user = await UserTable.findOne(
    { email }
    // { id: 1, password: 1, role: 1 }
  );

  // console.log(user);

  return user;
};

// password match
userSchema.methods.isPasswordMatch = async function (
  currentPassword: string,
  savePassword: string
): Promise<boolean> {
  console.log(currentPassword, savePassword);
  const user = await bcrypt.compare(currentPassword, savePassword);
  // console.log(user);
  return user;
};

// password hash before save password
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(Config.password_sold_round)
  );
  next();
});

export const UserTable = model<IUser, UserModel>("UserModel", userSchema);
