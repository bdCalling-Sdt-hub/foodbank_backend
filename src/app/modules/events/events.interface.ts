type EventType = "wed" | "birthday";
type userObj = {
  userId: string;
  email: string;
  accept: boolean;
}

type groupObj = {
  gid: string;
  type: string;
}

type IEvents = {
  eventName: string;
  eventType: EventType;
  location: string;
  messageDeliveryDriver: string;
  messageWarehouseVolunteer: string;
  dayOfEvent: Date;
  startOfEvent: string;
  endOfEvent: string;
  deliveryNeeded: number;
  warehouseNeeded: number;
  driver: [userObj],
  warehouse: [userObj],
  client: [userObj]
  groups: [groupObj]
};

type ISendMailEvent = {
  email: string;
  name: string;
  url: string;
  type: string;
  frontend_url: string;
  cancel_url: string;
  event_name: string;
  event_type: string;
  event_location: string;
  event_day_of_event: Date;
  event_start_of_event: string;
  event_end_of_event: string;
}

type IGroupRequest = {
  groupId: string;
  eventId: string;
  types: string
}

type IGetGroups = {
  eventId: string;
  page?: number;
  limit?: number;
  searchQuery?: string;
  type: string
}


// export default {IEvents, sendMailEvent};