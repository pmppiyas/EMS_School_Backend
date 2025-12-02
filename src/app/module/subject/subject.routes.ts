import { Router } from "express";
import { SubjectController } from "./subject.controller";

const router = Router();

router.post("/", SubjectController.createSubject);
router.get("/", SubjectController.getAllSubjects);
router.patch("/:id", SubjectController.editSubject);
router.delete("/:id", SubjectController.deleteSubject);

export const subjectRouter = router;
