import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { StudentController } from "./student.controller";
const router = Router();

router.get("/my", checkAuth(Role.STUDENT), StudentController.myFee);

export const studentRoutes = router;
