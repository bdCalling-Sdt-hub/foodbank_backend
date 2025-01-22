import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ClientGroupRoutes } from "../modules/clientGroup/clientGroup.route";
import { ClientRoutes } from "../modules/clients/clients.route";
import { DriverRoutes } from "../modules/drivers/drivers.route";
import { EventRouters } from "../modules/events/events.route";
import { GroupRoutes } from "../modules/groups/groups.route";
import { TransportVolunteerRoutes } from "../modules/TransportVolunteer/TransportVolunteer.route";
import { UserRouters } from "../modules/users/user.route";
import { VolunteerGroupRoutes } from "../modules/volunteerGroup/volunteerGroup.route";
import { WarehouseRoutes } from "../modules/warehouse/warehouse.route";

const router = express.Router();

const modulesRouters = [
  {
    path: "/user/",
    route: UserRouters,
  },
  {
    path: "/auth/",
    route: AuthRoutes,
  },

  {
    path: "/volunteers/",
    route: TransportVolunteerRoutes,
  },
  {
    path: "/warehouse/",
    route: WarehouseRoutes,
  },
  {
    path: "/client/",
    route: ClientRoutes,
  },
  {
    path: "/driver/",
    route: DriverRoutes,
  },
  {
    path: "/events",
    route: EventRouters,
  },
  {
    path: "/client-group",
    route: ClientGroupRoutes,
  },
  {
    path: "/events",
    route: EventRouters,
  },
  {
    path: "/volunteer-group",
    route: VolunteerGroupRoutes,
  },
  {
    path: "/groups",
    route: GroupRoutes,
  },
];

modulesRouters.forEach((route) => {
  // @ts-ignore
  router.use(route.path, route.route);
});

export default router;
