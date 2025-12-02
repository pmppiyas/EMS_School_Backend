import { Router } from "express";
import { ScheduleController } from "./schedule.controller";

const router = Router();

router.post("/:classId", ScheduleController.assignClassSchedule);

export const scheduleRouter = router;
