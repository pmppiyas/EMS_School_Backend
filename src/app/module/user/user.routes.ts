import { Router } from "express";
import multer from "multer";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import { Role } from "./user.interface";
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
  checkAuth(Role.ADMIN),
  upload.none(),
  validateRequest(createAdminZodSchema),
  UserController.createAdmin
);

router.post(
  "/create_teacher",
  checkAuth(Role.ADMIN),
  // ⚠️ এই debug middleware প্রথমে
  (req, res, next) => {
    console.log("\n=== 🚀 REQUEST RECEIVED ===");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Body (before multer):", req.body);
    next();
  },
  multerUpload.single("photo"),
  // ⚠️ multer এর পরে আরেকটা debug
  (req, res, next) => {
    console.log("\n=== 📦 AFTER MULTER ===");
    console.log("req.body:", JSON.stringify(req.body, null, 2));
    console.log("req.file:", req.file);
    next();
  },
  validateRequest(createTeacherZodSchema),
  UserController.createTeacher
);

router.put(
  "/:id/:status",
  validateRequest(userStatusChangeValidation),
  UserController.changeUserStatus
);

export const userRoutes = router;
