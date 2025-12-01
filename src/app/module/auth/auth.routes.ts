import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.crdLogin);
router.get("/me", AuthController.getMe);
export const authRoutes = router;
