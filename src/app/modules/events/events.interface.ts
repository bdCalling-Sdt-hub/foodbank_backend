type EventType = "wed" | "birthday";

type IEvents = {
  eventName: string;
  eventType: EventType;
  location: string;
  deliveryDriver: string;
  warehouseVolunteer: string;
  dayOfEvent: string;
  startOfEvent: string;
  endOfEvent: string;
  deliveryCount: string;
  warehouseVolunteerCount: string;
  eventVolunteers?: string[];
};
