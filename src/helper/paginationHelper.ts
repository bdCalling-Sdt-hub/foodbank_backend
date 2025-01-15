import { SortOrder } from "mongoose";

// pagination type
type IPaginationType = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
};

// pagination return type
type IPaginationResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: SortOrder;
};

const paginationCalculation = (potions: IPaginationType): IPaginationResult => {
  const page = potions.page || 1;
  const limit = potions.limit || 10;
  const skip = (page - 1) * limit;

  const sortBy = potions.sortBy || "createdAt";
  const sortOrder = potions.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const paginationHelper = {
  paginationCalculation,
};
