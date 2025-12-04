import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { NoticeController } from "./notice.controller";
const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN, Role.TEACHER),
  NoticeController.createNotice
);
router.get("/", NoticeController.getNotices);
router.get("/:id", NoticeController.getOneNotice);
router.patch("/:id", NoticeController.updateNotice);
router.delete("/:id", NoticeController.deleteNotice);

export const noticeRoutes = router;
