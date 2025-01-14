import { Model } from "mongoose";

export type IClient = {
  firstName: string;
  lastName: string;
  holocaustSurvivor: string;
  dateOfBirth: string;
  phoneNo: number;
  alternativePhoneNo: number;
  address: string;
  apartment?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  peopleHousehold?: string;
  badgeNumber: number;
  dietaryRestrictions: string;
  deliveryInstructions: string;
  clientDeliveryGroup: string;
};

export type ClientMethods = Model<IClient, Record<string, unknown>>;
