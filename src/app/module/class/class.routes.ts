import { Router } from "express";
import { ClassController } from "./class.controller";

const router = Router();

router.post("/create", ClassController.createClass);

export const classRouter = router;
