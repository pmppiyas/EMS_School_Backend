import { Router } from "express";
import { ClassController } from "./class.controller";

const router = Router();

router.post("/", ClassController.createClass);
router.get("/", ClassController.getClasses);
router.delete("/:id", ClassController.deleteClass);
router.patch("/:id", ClassController.editClass);

export const classRouter = router;
