import { Router } from "express";
import { path } from "path";
import { attendRoutes } from "../module/attendance/attend.routes";
import { authRoutes } from "../module/auth/auth.routes";
import { classRouter } from "../module/class/class.routes";
import { feeRoutes } from "../module/fee/fee.routes";
import { noticeRoutes } from "../module/notice/notice.routes";
import { resultRoutes } from "../module/result/result.routes";
import { scheduleRouter } from "../module/schedule/schedule.routes";
import { paymentRoutes } from "../module/sslpayment/payment.routes";
import { studentRoutes } from "../module/student/student.routes";
import { subjectRouter } from "../module/subject/subject.routes";
import { teacherRoutes } from "../module/teacher/teacher.routes";
import { userRoutes } from "../module/user/user.routes";

const router = Router();

interface routerArgs {
  path: string;
  route: Router;
}

const allRoutes: routerArgs[] = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/class",
    route: classRouter,
  },
  {
    path: "/subject",
    route: subjectRouter,
  },
  {
    path: "/schedule",
    route: scheduleRouter,
  },
  {
    path: "/notice",
    route: noticeRoutes,
  },
  {
    path: "/result",
    route: resultRoutes,
  },
  {
    path: "/fee",
    route: feeRoutes,
  },
  {
    path: "/student",
    route: studentRoutes,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
  {
    path: "/attendance",
    route: attendRoutes,
  },
  {
    path: "/teacher",
    route: teacherRoutes,
  },
];

allRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
