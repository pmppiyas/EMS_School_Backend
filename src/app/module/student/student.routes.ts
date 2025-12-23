import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user.interface';
import { StudentController } from './student.controller';
const router = Router();




router.get(
  '/',
  checkAuth(Role.ADMIN, Role.TEACHER),
  StudentController.allStudents
);

router.delete(
  '/:id',
  checkAuth(Role.ADMIN, Role.TEACHER),
  StudentController.deleteStudent
);

router.put(
  '/:id',
  checkAuth(...Object.values(Role)),
  StudentController.updateStudent
);

export const studentRoutes = router;
