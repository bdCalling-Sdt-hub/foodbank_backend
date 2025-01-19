export type IModule = {
  route: string;
  path: string;
};

export type IChangePassword = {
  id: string;
  oldPassword: string;
  newPassword: string;
};

export type IForgot = {
  id: string;
  email: string;
};

export type IResetPassword = {
  email?: string;
  resetPassword?: string;
  otp?: string;
};

export type IOTP = {
  email: string;
  otp: string;
};
