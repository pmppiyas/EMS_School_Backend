import { Router } from "express";
import { TeacherController } from "./teacher.controller";
const router = Router();

router.get("/", TeacherController.getAllTeachers);

export const teacherRoutes = router;
