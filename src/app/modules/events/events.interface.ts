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
  driver: [userObj],
  warehouse: [userObj],
  client: [userObj]

};

type ISendMailEvent = {
  email: string;
  name: string;
  url: string;
  type: string;
  frontend_url: string;
  event_name: string;
  event_type: string;
  event_location: string;
  event_day_of_event: string;
  event_start_of_event: string;
  event_end_of_event: string;
}


// export default {IEvents, sendMailEvent};