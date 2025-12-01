import { Router } from "express";
import multer from "multer";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import { Role } from "./user.interface";
import {
  createAdminZodSchema,
  createStudentZodSchema,
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

export const userRoutes = router;
