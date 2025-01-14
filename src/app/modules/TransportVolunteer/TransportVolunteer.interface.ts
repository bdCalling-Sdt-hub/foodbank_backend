import { Model } from "mongoose";

type IVolunteerRole = "driver" | "warehouse" | "both";
type IStatus = "client" | "driver" | "warehouse";

export type ITransportVolunteer = {
  firstName: string;
  lastName: string;
  holocaustSurvivor?: string;
  dateOfBirth?: string;
  phoneNo: number;
  alternativePhoneNo?: number;
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

  // volunteer unique fields
  volunteerType?: boolean;
  volunteerRole?: IVolunteerRole; // "driver" | "warehouse" | "both";
  status: IStatus; // "client" | "drive" | "warehouse";
};

export type TransportVolunteerMethods = Model<
  ITransportVolunteer,
  Record<string, unknown>
>;
