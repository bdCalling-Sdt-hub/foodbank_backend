import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ClientRoutes } from "../modules/clients/clients.route";
import { TransportVolunteerRoutes } from "../modules/TransportVolunteer/TransportVolunteer.route";
import { UserRouters } from "../modules/users/user.route";

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
    path: "/client/",
    route: ClientRoutes,
  },
  {
    path: "/volunteers/",
    route: TransportVolunteerRoutes,
  },
];

modulesRouters.forEach((route) => {
  // @ts-ignore
  router.use(route.path, route.route);
});

export default router;
