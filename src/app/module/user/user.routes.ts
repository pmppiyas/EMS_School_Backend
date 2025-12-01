import { Router } from "express";
import multer from "multer";
import { validateRequest } from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import {
  createAdminZodSchema,
  createStudentZodSchema,
  createTeacherZodSchema,
  userStatusChangeValidation,
} from "./user.validation";
const upload = multer();

const router = Router();

router.get("/", UserController.getAllUser);

router.post(
  "/create_student",
  upload.none(),
  validateRequest(createStudentZodSchema),
  UserController.createStudent
);

router.post(
  "/create_admin",
  upload.none(),
  validateRequest(createAdminZodSchema),
  UserController.createAdmin
);

router.post(
  "/create_teacher",
  upload.none(),
  validateRequest(createTeacherZodSchema),
  UserController.createTeacher
);

router.put(
  "/:id/:status",
  validateRequest(userStatusChangeValidation),
  UserController.changeUserStatus
);

export const userRoutes = router;
