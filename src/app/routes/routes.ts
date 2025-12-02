import { Router } from "express";
import * as zod from "zod";
import { authRoutes } from "../module/auth/auth.routes";
import { classRouter } from "../module/class/class.routes";
import { scheduleRouter } from "../module/schedule/schedule.routes";
import { subjectRouter } from "../module/subject/subject.routes";
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
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/class",
    route: classRouter,
  },
  {
    path: "/subject",
    route: subjectRouter,
  },
  {
    path: "/schedule",
    route: scheduleRouter,
  },
];

allRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
export default router;
export const createStudentZodSchema = zod.object({
  body: zod.object({
    firstName: zod.string().min(1, "First name is required"),
    lastName: zod.string().min(1, "Last name is required"),
    email: zod.string().email("Invalid email address"),
    phoneNumber: zod.string().optional(),
    address: zod.string().optional(),
    dateOfBirth: zod.string().datetime().optional(),
    class: zod.string().min(1, "Class is required"),
    roll: zod.string().min(1, "Roll is required"),
    gender: zod.enum(["MALE", "FEMALE"]),
    userId: zod.string().uuid("Invalid userId format"),
  }),
});
