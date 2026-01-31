import { Router } from 'express';
import multer from 'multer';
import { multerUpload } from '../../config/multer.config';
import { checkAuth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { UserController } from './user.controller';
import { Role } from './user.interface';
import {
  createAdminZodSchema,
  createStudentZodSchema,
  createTeacherZodSchema,
  userStatusChangeValidation,
} from './user.validation';

const upload = multer();

const router = Router();

router.get('/', UserController.getAllUser);

router.post(
  '/create_student',
  multerUpload.single('photo'),
  validateRequest(createStudentZodSchema),
  UserController.createStudent
);

router.post(
  '/create_admin',
  checkAuth(Role.ADMIN),
  upload.none(),
  validateRequest(createAdminZodSchema),
  UserController.createAdmin
);

router.post(
  '/create_teacher',
  checkAuth(Role.ADMIN),
  multerUpload.single('photo'),
  validateRequest(createTeacherZodSchema),
  UserController.createTeacher
);

router.put(
  '/:id/:status',
  validateRequest(userStatusChangeValidation),
  UserController.changeUserStatus
);

router.get('/me', checkAuth(...Object.values(Role)), UserController.getMe);

router.patch(
  '/update-me',
  checkAuth(...Object.values(Role)),
  multerUpload.single('photo'),
  UserController.updateMe
);

export const userRoutes = router;
