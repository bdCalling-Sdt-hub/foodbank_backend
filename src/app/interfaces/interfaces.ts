type IGenericErrorMessage = {
  path: string | number;
  message: string;
};
export default IGenericErrorMessage;

export type IPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
