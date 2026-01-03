import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user.interface';
import { StudentController } from './student.controller';
import { multerUpload } from '../../config/multer.config';
import { validateRequest } from '../../middleware/validateRequest';
import { updateStudentZodSchema } from './student.validation';
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
  multerUpload.single('photo'),
  validateRequest(updateStudentZodSchema),
  StudentController.updateStudent
);

router.get(
  '/:id',
  checkAuth(...Object.values(Role)),
  StudentController.getById
);

export const studentRoutes = router;
