import { Router } from "express";
import { userRoutes } from "../module/user/user.routes";

const router = Router();

interface routerArgs {
  path: string;
  route: Router;
}

const allRoutes: routerArgs[] = [
  {
    path: "/user",
    route: userRoutes,
  },
];

allRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
export default router;
