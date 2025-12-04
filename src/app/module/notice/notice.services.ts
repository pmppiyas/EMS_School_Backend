import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";

const createNotice = async (
  payload: { title: string; message: string; pinned: false },
  userId: string
) => {
  return await prisma.notice.create({
    data: {
      title: payload.title,
      message: payload.message,
      pinned: payload.pinned!,
      createdBy: userId,
    },
  });
};

const getNotices = async () => {
  const total = await prisma.notice.count();
  const notices = await prisma.notice.findMany();
  return {
    notices,
    mata: {
      total,
    },
  };
};

const getOneNotice = async (noticeId: string) => {
  const notice = await prisma.notice.findUnique({
    where: {
      id: noticeId,
    },
  });

  if (!notice) {
    throw new AppError(StatusCodes.NOT_FOUND, "Notice not found");
  }
  return notice;
};

const updateNotice = async (noticeId: string, data: any) => {
  const notice = await prisma.notice.findUnique({
    where: {
      id: noticeId,
    },
  });

  if (!notice) {
    throw new AppError(StatusCodes.NOT_FOUND, "Notice not found");
  }

  return await prisma.notice.update({
    where: { id: noticeId },
    data,
  });
};

const deleteNotice = async (noticeId: string) => {
  const notice = await prisma.notice.findUnique({
    where: {
      id: noticeId,
    },
  });

  if (!notice) {
    throw new AppError(StatusCodes.NOT_FOUND, "Notice not found");
  }
  await prisma.notice.delete({
    where: { id: noticeId },
  });
  return null;
};

export const NoticeServices = {
  createNotice,
  getNotices,
  getOneNotice,
  updateNotice,
  deleteNotice,
};
