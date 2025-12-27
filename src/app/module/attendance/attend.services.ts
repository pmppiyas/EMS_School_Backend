import { StatusCodes } from 'http-status-codes';
import prisma from '../../config/prisma';
import { AppError } from '../../utils/appError';
import { Role } from '../user/user.interface';
import { IAttendStatus } from './attend.interface';
import { formatBDTime } from '../../utils/dateFormat';

const markAttendance = async (
  payload: {
    classId?: string;
    records: { userId: string; inTime?: string; outTime?: string }[];
  },
  user: { email: string }
) => {
  const { classId, records } = payload;

  const now = new Date();
  const bdtNow = new Date(now.getTime() + 6 * 60 * 60 * 1000);
  const today = new Date(bdtNow);
  today.setUTCHours(0, 0, 0, 0);

  const firstPeriod = await prisma.classTime.findFirst({
    orderBy: { startTime: 'asc' },
  });

  if (!firstPeriod) {
    throw new AppError(StatusCodes.NOT_FOUND, 'No class schedule found');
  }

  const CLASS_START_HOUR = parseInt(firstPeriod.startTime.split(':')[0]);
  const CLASS_START_MINUTE = parseInt(firstPeriod.startTime.split(':')[1]);
  const LATE_MINUTE_LIMIT = CLASS_START_MINUTE + 5;

  return await prisma.$transaction(async (tx) => {
    const summary: Record<IAttendStatus, { count: number; users: string[] }> = {
      PRESENT: { count: 0, users: [] },
      ABSENT: { count: 0, users: [] },
      LATE: { count: 0, users: [] },
      LEAVE: { count: 0, users: [] },
    };

    for (const rec of records) {
      const existUser = await tx.user.findUnique({
        where: { id: rec.userId },
        select: { id: true, role: true },
      });

      if (!existUser)
        throw new AppError(
          StatusCodes.NOT_FOUND,
          `User not found: ${rec.userId}`
        );

      let finalStatus: IAttendStatus;

      if (rec.outTime) {
        finalStatus = IAttendStatus.LEAVE;
      } else if (rec.inTime) {
        const inDateUTC = new Date(rec.inTime);
        const hours = inDateUTC.getUTCHours();
        const minutes = inDateUTC.getUTCMinutes();

        if (
          hours > CLASS_START_HOUR ||
          (hours === CLASS_START_HOUR && minutes > LATE_MINUTE_LIMIT)
        ) {
          finalStatus = IAttendStatus.LATE;
        } else {
          finalStatus = IAttendStatus.PRESENT;
        }
      } else {
        finalStatus = IAttendStatus.ABSENT;
      }

      summary[finalStatus].count++;
      summary[finalStatus].users.push(rec.userId);

      const targetClassId = existUser.role === 'STUDENT' ? classId : null;

      const existAttendance = await tx.attendance.findFirst({
        where: {
          userId: rec.userId,
          createdAt: {
            gte: new Date(today.getTime() - 6 * 60 * 60 * 1000),
            lt: new Date(today.getTime() + 18 * 60 * 60 * 1000),
          },
        },
      });

      const attendanceData = {
        status: finalStatus,
        inTime: rec.inTime ? new Date(rec.inTime) : null,
        outTime: rec.outTime ? new Date(rec.outTime) : null,
        notedBy: user.email,
        classId: targetClassId,
      };

      if (existAttendance) {
        await tx.attendance.update({
          where: { id: existAttendance.id },
          data: attendanceData,
        });
      } else {
        await tx.attendance.create({
          data: {
            ...attendanceData,
            userId: rec.userId,
            createdAt: now,
          },
        });
      }
    }

    return summary;
  });
};

const getTeacherAttendance = async (date?: string) => {
  let targetDate: Date;

  if (date) {
    targetDate = new Date(`${date}T00:00:00`);
  } else {
    const now = new Date();
    targetDate = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    targetDate.setUTCHours(0, 0, 0, 0);
  }

  const startRange = new Date(targetDate);
  startRange.setHours(startRange.getHours() - 6);

  const endRange = new Date(startRange.getTime() + 24 * 60 * 60 * 1000);

  const attendance = await prisma.attendance.findMany({
    where: {
      createdAt: { gte: startRange, lt: endRange },
      user: { role: 'TEACHER' },
    },
    include: {
      user: { include: { teacher: true } },
    },
  });

  const categories = {
    PRESENT: [] as any[],
    ABSENT: [] as any[],
    LATE: [] as any[],
    LEAVE: [] as any[],
  };

  attendance.forEach((att) => {
    const teacher = att.user.teacher;
    if (!teacher) return;
    const info = {
      id: teacher.id,
      userId: att.userId,
      name: `${teacher.firstName} ${teacher.lastName}`,
      status: att.status,
      inTime: att.inTime,
      outTime: att.outTime,
    };
    if (categories[att.status as keyof typeof categories]) {
      categories[att.status as keyof typeof categories].push(info);
    }
  });

  return {
    date: date || targetDate.toISOString().split('T')[0],
    teacher: {
      present: { total: categories.PRESENT.length, list: categories.PRESENT },
      absent: { total: categories.ABSENT.length, list: categories.ABSENT },
      late: { total: categories.LATE.length, list: categories.LATE },
      leave: { total: categories.LEAVE.length, list: categories.LEAVE },
    },
  };
};

const getStudentAttendance = async (date?: string) => {
  let targetDate: Date;

  if (date) {
    targetDate = new Date(`${date}T00:00:00`);
  } else {
    const now = new Date();
    targetDate = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    targetDate.setUTCHours(0, 0, 0, 0);
  }

  const startRange = new Date(targetDate);
  startRange.setHours(startRange.getHours() - 6);
  const endRange = new Date(startRange.getTime() + 24 * 60 * 60 * 1000);

  const attendance = await prisma.attendance.findMany({
    where: {
      createdAt: { gte: startRange, lt: endRange },
      user: { role: 'STUDENT' },
    },
    include: {
      user: {
        include: {
          student: true,
        },
      },
      class: true,
    },
  });

  const presentStudents: any[] = [];
  const absentStudents: any[] = [];
  const lateStudents: any[] = [];

  attendance.forEach((att) => {
    const studentInfo = att.user?.student;
    if (!studentInfo) return;

    const info = {
      id: att.user.id,
      userId: att.userId,
      name: `${studentInfo.firstName} ${studentInfo.lastName}`,
      classId: att.classId,
      className: att.class?.name || 'UNKNOWN',
      status: att.status,
      inTime: att.inTime,
      outTime: att.outTime,
    };

    if (att.status === IAttendStatus.PRESENT) presentStudents.push(info);
    else if (att.status === IAttendStatus.ABSENT) absentStudents.push(info);
    else if (att.status === IAttendStatus.LATE) lateStudents.push(info);
    else {
      absentStudents.push(info);
    }
  });

  return {
    date: date || targetDate.toISOString().split('T')[0],
    student: {
      present: { total: presentStudents.length, list: presentStudents },
      absent: { total: absentStudents.length, list: absentStudents },
      late: { total: lateStudents.length, list: lateStudents },
    },
  };
};

const generateDailyAttendance = async () => {
  const BDT_OFFSET_HOURS = 6;
  const nowUTC = new Date();

  const todayBDT = new Date(
    nowUTC.getTime() + BDT_OFFSET_HOURS * 60 * 60 * 1000
  );
  todayBDT.setUTCHours(0, 0, 0, 0);

  const nextDayBDT = new Date(todayBDT.getTime() + 24 * 60 * 60 * 1000);

  const users = await prisma.user.findMany({
    include: {
      student: { include: { class: true } },
      teacher: true,
      admin: true,
    },
  });

  return await prisma.$transaction(async (tx) => {
    for (const u of users) {
      let classId: string | null =
        u.role === Role.STUDENT ? u.student?.classId ?? null : null;

      const exist = await tx.attendance.findFirst({
        where: {
          userId: u.id,
          createdAt: {
            gte: todayBDT,
            lt: nextDayBDT,
          },
        },
      });

      if (!exist) {
        await tx.attendance.create({
          data: {
            userId: u.id,
            classId,
            status: IAttendStatus.ABSENT,
            notedBy: 'SYSTEM',
            createdAt: todayBDT,
          },
        });
      }
    }
  });
};

export const AttendServices = {
  markAttendance,
  getTeacherAttendance,
  generateDailyAttendance,
  getStudentAttendance,
};
