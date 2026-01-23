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

router.get(
  '/my/:month/:year',
  checkAuth(...Object.values(Role)),
  AttendController.getAttendanceByUser
);

export const attendRoutes = router;
