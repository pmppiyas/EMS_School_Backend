import { Router } from "express";
import { ScheduleController } from "./schedule.controller";

const router = Router();

router.post("/:classId", ScheduleController.assignClassSchedule);
router.get("/", ScheduleController.getAllSchedules);
export const scheduleRouter = router;
