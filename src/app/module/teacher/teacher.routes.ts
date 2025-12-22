import { Router } from 'express';
import { TeacherController } from './teacher.controller';
const router = Router();

router.get('/', TeacherController.getAllTeachers);
router.delete('/:id', TeacherController.deleteTeacher);
router.put('/:id', TeacherController.updateTeacher);
router.get('/:id', TeacherController.getTeacherById);

export const teacherRoutes = router;
