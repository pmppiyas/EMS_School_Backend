import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { IUser } from "../user/user.interface";
import { IAttendRecord, IAttendStatus } from "./attend.interface";

const markAttendance = async (
  payload: { classId?: string; records: IAttendRecord[] },
  user: IUser
) => {
  const { classId, records } = payload;

  const existClass = await prisma.class.findUnique({
    where: { id: classId },
  });

  if (!existClass) {
    throw new AppError(StatusCodes.NOT_FOUND, "Class not found.");
  }

  const allStudents = await prisma.student.findMany({
    where: { classId: classId },
    select: { id: true },
  });
  const totalStudents = allStudents.length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await prisma.$transaction(async (tx) => {
    const result = [];
    const counts = {
      PRESENT: 0,
      LEAVE: 0,
      ABSENT: 0,
    };

    for (const rec of records) {
      const existUser = await tx.user.findUnique({ where: { id: rec.userId } });
      if (!existUser) {
        throw new AppError(
          StatusCodes.NOT_FOUND,
          `User not found: ${rec.userId}`
        );
      }

      let finalStatus: IAttendStatus;
      if (rec.outTime) finalStatus = IAttendStatus.LEAVE;
      else if (rec.inTime) finalStatus = IAttendStatus.PRESENT;
      else finalStatus = IAttendStatus.ABSENT;

      counts[finalStatus]++;

      const existAttendance = await tx.attendance.findFirst({
        where: {
          userId: rec.userId,
          createdAt: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      });

      const attendance = existAttendance
        ? await tx.attendance.update({
            where: { id: existAttendance.id },
            data: {
              status: finalStatus,
              inTime: rec.inTime ? new Date(rec.inTime) : undefined,
              outTime: rec.outTime ? new Date(rec.outTime) : undefined,
            },
          })
        : await tx.attendance.create({
            data: {
              userId: rec.userId,
              classId: existClass.id,
              createdAt: today,
              status: finalStatus,
              inTime: rec.inTime ? new Date(rec.inTime) : null,
              outTime: rec.outTime ? new Date(rec.outTime) : null,
              notedBy: user.email,
            },
          });

      result.push(attendance);
    }

    return {
      totalStudents,
      counts,
    };
  });
};

export const AttendServices = { markAttendance };
