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

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.TEACHER),
  ResultController.getAllResults
);

router.get("/my", checkAuth(Role.STUDENT), ResultController.getMyResults);

export const resultRoutes = router;
