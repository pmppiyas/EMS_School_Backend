import { Router } from "express";
import { PaymentController } from "./payment.controller";
const router = Router();

router.post("/", PaymentController.paymentInit);

export const paymentRoutes = router;
