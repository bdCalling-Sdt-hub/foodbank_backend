// filter user
export type IClientFilterKey = {
  searchTerm?: string;
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
  status: string;
};
