import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { IUser, Role } from "../user/user.interface";
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await prisma.$transaction(async (tx) => {
    const summary = {
      PRESENT: { count: 0, users: [] as string[] },
      ABSENT: { count: 0, users: [] as string[] },
      LEAVE: { count: 0, users: [] as string[] },
    };

    for (const rec of records) {
      const existUser = await tx.user.findUnique({
        where: { id: rec.userId },
      });

      if (!existUser) {
        throw new AppError(
          StatusCodes.NOT_FOUND,
          `User not found: ${rec.userId}`
        );
      }

      // Determine status
      let finalStatus: IAttendStatus;
      if (rec.outTime) finalStatus = IAttendStatus.LEAVE;
      else if (rec.inTime) finalStatus = IAttendStatus.PRESENT;
      else finalStatus = IAttendStatus.ABSENT;

      // Add to summary
      summary[finalStatus].count++;
      summary[finalStatus].users.push(rec.userId);

      // Check existing attendance for today
      const existAttendance = await tx.attendance.findFirst({
        where: {
          userId: rec.userId,
          createdAt: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      });

      // Update or create attendance
      if (existAttendance) {
        await tx.attendance.update({
          where: { id: existAttendance.id },
          data: {
            status: finalStatus,
            inTime: rec.inTime ? new Date(rec.inTime) : undefined,
            outTime: rec.outTime ? new Date(rec.outTime) : undefined,
            notedBy: user.email,
          },
        });
      } else {
        await tx.attendance.create({
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
      }
    }

    return summary;
  });
};

export const getAttendance = async (classId?: string, user?: IUser) => {
  if (!user) throw new AppError(StatusCodes.UNAUTHORIZED, "User not provided");

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const totalAdmins = await prisma.user.count({ where: { role: Role.ADMIN } });

  const totalTeachers = await prisma.user.count({
    where: { role: Role.TEACHER },
  });

  const allStudents = await prisma.student.findMany({
    include: { class: true },
  });

  const totalStudents =
    Number(totalAdmins) + Number(totalTeachers) + Number(allStudents.length);

  const filteredStudents = classId
    ? allStudents.filter((s) => s.classId === classId)
    : allStudents;

  const attendance = await prisma.attendance.findMany({
    where: {
      createdAt: { gte: todayStart, lte: todayEnd },
    },
    include: {
      user: true,
      class: true,
    },
  });

  const adminSummary = {
    total: totalAdmins,
    present: 0,
    absent: totalAdmins,
    leave: 0,
  };
  const teacherSummary = {
    total: totalTeachers,
    present: 0,
    absent: totalTeachers,
    leave: 0,
  };
  const studentSummary: any = { total: totalStudents };

  filteredStudents.forEach((s) => {
    const className = s.class?.name || "UNKNOWN";
    if (!studentSummary[className]) {
      studentSummary[className] = { total: 0, present: 0, absent: 0, leave: 0 };
    }
    studentSummary[className].total++;
    studentSummary[className].absent++;
  });

  attendance.forEach((a) => {
    const role = a.user?.role;
    const status = a.status;

    if (role === Role.ADMIN) {
      if (status !== IAttendStatus.ABSENT) adminSummary.absent--;
      if (status === IAttendStatus.PRESENT) adminSummary.present++;
      if (status === IAttendStatus.LEAVE) adminSummary.leave++;
    }

    if (role === Role.TEACHER) {
      if (status !== IAttendStatus.ABSENT) teacherSummary.absent--;
      if (status === IAttendStatus.PRESENT) teacherSummary.present++;
      if (status === IAttendStatus.LEAVE) teacherSummary.leave++;
    }

    if (role === Role.STUDENT) {
      const className = a.class?.name || "UNKNOWN";
      if (!studentSummary[className]) return;
      if (status !== IAttendStatus.ABSENT) studentSummary[className].absent--;
      if (status === IAttendStatus.PRESENT) studentSummary[className].present++;
      if (status === IAttendStatus.LEAVE) studentSummary[className].leave++;
    }
  });

  if (user.role === Role.ADMIN) {
    return {
      admin: adminSummary,
      teacher: teacherSummary,
      student: studentSummary,
    };
  }

  if (user.role === Role.TEACHER) {
    return {
      teacher: teacherSummary,
      student: studentSummary,
    };
  }

  if (user.role === Role.STUDENT) {
    const attendance = await prisma.attendance.findMany({
      where: { userId: user.id },
      include: { class: true },
      orderBy: { createdAt: "desc" },
    });

    const groupedByMonth: Record<string, any[]> = {};

    attendance.forEach((att) => {
      const date = new Date(att.createdAt);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

      if (!groupedByMonth[monthKey]) groupedByMonth[monthKey] = [];
      groupedByMonth[monthKey].push({
        id: att.id,
        classId: att.classId,
        status: att.status,
        inTime: att.inTime,
        outTime: att.outTime,
        notedBy: att.notedBy,
        createdAt: att.createdAt,
      });
    });
    return groupedByMonth;
  }

  throw new AppError(StatusCodes.FORBIDDEN, "Access Denied");
};

const generateDailyAttendance = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const users = await prisma.user.findMany({
    include: {
      student: { include: { class: true } },
      teacher: true,
      admin: true,
    },
  });

  return await prisma.$transaction(async (tx) => {
    for (const u of users) {
      let classId: string | null = null;

      switch (u.role) {
        case Role.STUDENT:
          classId = u.student?.classId ?? null;
          break;

        case Role.TEACHER:
        case Role.ADMIN:
          classId = null;
          break;
      }

      await tx.attendance.upsert({
        where: {
          id_createdAt: {
            id: u.id,
            createdAt: new Date(today),
          },
        },
        create: {
          id: u.id,
          userId: u.id,
          notedBy: "SYSTEM",
          status: "ABSENT",
          classId: classId,
          createdAt: new Date(today),
        },
        update: {},
      });
    }
  });
};

export const AttendServices = {
  markAttendance,
  getAttendance,
  generateDailyAttendance,
};
