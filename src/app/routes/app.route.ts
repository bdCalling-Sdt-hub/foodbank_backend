import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ClientRoutes } from "../modules/clients/clients.route";
import { DriverRoutes } from "../modules/drivers/drivers.route";
import { EventRouters } from "../modules/events/events.route";
import { TransportVolunteerRoutes } from "../modules/TransportVolunteer/TransportVolunteer.route";
import { UserRouters } from "../modules/users/user.route";
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
];

modulesRouters.forEach((route) => {
  // @ts-ignore
  router.use(route.path, route.route);
});

export default router;
