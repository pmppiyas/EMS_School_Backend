import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { AttendController } from "./attend.controller";
const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN, Role.TEACHER),
  AttendController.markAttendance
);

router.get(
  "/",
  checkAuth(...Object.values(Role)),
  AttendController.getAttendance
);
export const attendRoutes = router;
