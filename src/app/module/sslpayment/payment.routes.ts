import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { PaymentController } from "./payment.controller";
const router = Router();

router.post("/", checkAuth(Role.STUDENT), PaymentController.paymentInit);
router.post("/success", PaymentController.successPayment);
router.post("/fail", PaymentController.failPayment);
router.post("/cancel", PaymentController.cancelPayment);

export const paymentRoutes = router;
