import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { ScheduleController } from "./schedule.controller";

const router = Router();

router.post("/:classId", ScheduleController.assignClassSchedule);
router.get("/", ScheduleController.getAllSchedules);

router.get(
  "/my",
  checkAuth(Role.TEACHER, Role.ADMIN),
  ScheduleController.mySchedules
);
export const scheduleRouter = router;
