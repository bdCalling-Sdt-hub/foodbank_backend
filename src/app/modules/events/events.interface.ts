type EventType = "wed" | "birthday";
type userObj = {
  userId: string;
  email: string;
  accept: boolean;
} 

type IEvents = {
  eventName: string;
  eventType: EventType;
  location: string;
  messageDeliveryDriver: string;
  messageWarehouseVolunteer: string;
  dayOfEvent: string;
  startOfEvent: string;
  endOfEvent: string;
  deliveryNeeded: number;
  warehouseNeeded: number; 
  driver: userObj,
  warehouse: userObj,
  client: userObj

};
