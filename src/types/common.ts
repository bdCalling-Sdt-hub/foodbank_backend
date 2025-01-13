export type IModule = {
  route: string;
  path: string;
};

export type IChangePassword = {
  id: string;
  oldPassword: string;
  newPassword: string;
};
