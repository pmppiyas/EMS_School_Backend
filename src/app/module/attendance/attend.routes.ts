import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user.interface';
import { AttendController } from './attend.controller';
const router = Router();

router.post(
  '/',
  checkAuth(Role.ADMIN, Role.TEACHER),
  AttendController.markAttendance
);

router.get(
  '/teacher',
  checkAuth(Role.ADMIN, Role.TEACHER),
  AttendController.getTeacherAttendance
);

router.get(
  '/student',
  checkAuth(Role.ADMIN, Role.TEACHER),
  AttendController.getStudnetAttendance
);

export const attendRoutes = router;
