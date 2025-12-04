import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { ResultController } from "./result.controller";

const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN, Role.TEACHER),
  ResultController.addResult
);

export const resultRoutes = router;
