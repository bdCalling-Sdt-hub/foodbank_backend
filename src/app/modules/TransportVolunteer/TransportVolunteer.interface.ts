import { Model } from "mongoose";

type IVolunteerRole = "driver" | "warehouse" | "both";
type IStatus = "client" | "driver" | "warehouse";

export type ITransportVolunteer = {
  firstName: string;
  lastName: string;
  holocaustSurvivor: boolean;
  dateOfBirth?: string;
  phoneNo: string;
  alternativePhoneNo?: string;
  address: string;
  apartment?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  peopleHousehold?: string;
  badgeNumber?: number;
  dietaryRestrictions?: string;
  deliveryInstructions?: string;
  clientDeliveryGroup?: string;
  email?: string;

  // volunteer unique fields
  volunteerType?: boolean; // vip | regular
  volunteerRole?: IVolunteerRole; // "driver" | "warehouse" | "both";
  status: IStatus; // "client" | "drive" | "warehouse";
  meetings?: [string];
  volunteers?: [string];
};

export type TransportVolunteerMethods = Model<
  ITransportVolunteer,
  Record<string, unknown>
>;

// filter user
export type ITransportVolunteerFilters = {
  searchTerm?: string;
  firstName: string;
  lastName: string;
  holocaustSurvivor?: string;
  dateOfBirth?: string;
  phoneNo: string;
  alternativePhoneNo?: string;
  address: string;
  apartment?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  peopleHousehold?: string;
  badgeNumber?: number;
  dietaryRestrictions?: string;
  deliveryInstructions?: string;
  clientDeliveryGroup?: string;
  email?: string;
};
