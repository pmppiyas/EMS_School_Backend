import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { FeeControllers } from "./fee.controller";

const router = Router();

router.post("/", checkAuth(Role.ADMIN), FeeControllers.createFee);
router.get("/", checkAuth(Role.ADMIN), FeeControllers.getAllFee);

// Fee types
router.post(
  "/type",
  checkAuth(Role.ADMIN, Role.TEACHER),
  FeeControllers.createFeeType
);

router.delete(
  "/type/:id",
  checkAuth(Role.ADMIN, Role.TEACHER),
  FeeControllers.deleteFeeType
);

export const feeRoutes = router;
