import { StatusCodes } from 'http-status-codes';
import prisma from '../../config/prisma';
import { AppError } from '../../utils/appError';
import { Role } from '../user/user.interface';
import { IAttendStatus } from './attend.interface';

const markAttendance = async (
  payload: {
    records: {
      userId: string;
      inTime?: string | null;
      outTime?: string | null;
      status?: IAttendStatus;
    }[];
  },
  user: { email: string }
) => {
  const { records } = payload;

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

  const [CLASS_START_HOUR, CLASS_START_MINUTE] = firstPeriod.startTime
    .split(':')
    .map(Number);

  const LATE_MINUTE_LIMIT = CLASS_START_MINUTE + 5;

  return await prisma.$transaction(async (tx) => {
    const summary: Record<IAttendStatus, { count: number; users: string[] }> = {
      PRESENT: { count: 0, users: [] },
      ABSENT: { count: 0, users: [] },
      LATE: { count: 0, users: [] },
      LEAVE: { count: 0, users: [] },
    };

    for (const rec of records) {
      if (
        rec.inTime === undefined &&
        rec.outTime === undefined &&
        rec.status === undefined
      ) {
        continue;
      }

      const existUser = await tx.user.findUnique({
        where: { id: rec.userId },
        select: { id: true, role: true },
      });

      if (!existUser) {
        throw new AppError(
          StatusCodes.NOT_FOUND,
          `User not found: ${rec.userId}`
        );
      }

      let finalStatus: IAttendStatus | undefined;

      if (rec.inTime === null) {
        finalStatus = IAttendStatus.ABSENT;
      } else if (rec.outTime && rec.inTime !== null) {
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
      } else if (rec.status) {
        finalStatus = rec.status;
      } else {
        continue;
      }

      summary[finalStatus].count++;
      summary[finalStatus].users.push(rec.userId);

      let targetClassId: string | null = null;

      if (existUser.role === 'STUDENT') {
        const userData = await tx.user.findUnique({
          where: { id: existUser.id },
          include: { student: { select: { classId: true } } },
        });
        targetClassId = userData?.student?.classId ?? null;
      }

      const existAttendance = await tx.attendance.findFirst({
        where: {
          userId: rec.userId,
          createdAt: {
            gte: new Date(today.getTime() - 6 * 60 * 60 * 1000),
            lt: new Date(today.getTime() + 18 * 60 * 60 * 1000),
          },
        },
      });

      const attendanceData: any = {
        status: finalStatus,
        notedBy: user.email,
        classId: targetClassId,
      };

      if (rec.inTime === null) {
        attendanceData.inTime = null;
        attendanceData.outTime = null;
      } else if (rec.inTime !== undefined) {
        attendanceData.inTime = rec.inTime ? new Date(rec.inTime) : null;
      }

      if (rec.outTime !== undefined && rec.inTime !== null) {
        attendanceData.outTime = rec.outTime ? new Date(rec.outTime) : null;
      }

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

  const totalTeacher = await prisma.teacher.count({});

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
      total: totalTeacher,
      present: { total: categories.PRESENT.length, list: categories.PRESENT },
      absent: { total: categories.ABSENT.length, list: categories.ABSENT },
      late: { total: categories.LATE.length, list: categories.LATE },
      leave: { total: categories.LEAVE.length, list: categories.LEAVE },
    },
  };
};

const getStudentAttendance = async (classId?: string, date?: string) => {
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
      classId,
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
    orderBy: {
      user: {
        student: {
          roll: 'asc',
        },
      },
    },
  });

  const totalStudent = await prisma.student.count({});

  const categories = {
    PRESENT: [] as any[],
    ABSENT: [] as any[],
    LATE: [] as any[],
    LEAVE: [] as any[],
  };

  attendance.forEach((att) => {
    const studentInfo = att.user?.student;
    if (!studentInfo) return;

    const info = {
      id: studentInfo.id,
      userId: att.userId,
      name: `${studentInfo.firstName} ${studentInfo.lastName}`,
      roll: studentInfo.roll,
      number: studentInfo.phoneNumber,
      classId: att.classId,
      className: att.class?.name || 'UNKNOWN',
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
    student: {
      total: totalStudent,
      present: {
        total: categories.PRESENT.length,
        list: categories.PRESENT,
      },
      absent: {
        total: categories.ABSENT.length,
        list: categories.ABSENT,
      },
      late: {
        total: categories.LATE.length,
        list: categories.LATE,
      },
      leave: {
        total: categories.LEAVE.length,
        list: categories.LEAVE,
      },
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
      student: true,
    },
  });

  for (const u of users) {
    try {
      const classId = u.role === 'STUDENT' ? u.student?.classId ?? null : null;

      const exist = await prisma.attendance.findFirst({
        where: {
          userId: u.id,
          createdAt: {
            gte: todayBDT,
            lt: nextDayBDT,
          },
        },
      });

      if (!exist) {
        await prisma.attendance.create({
          data: {
            userId: u.id,
            classId,
            status: 'ABSENT',
            notedBy: 'SYSTEM',
            createdAt: todayBDT,
          },
        });
      }
    } catch (err) {
      console.error(`Error for user ${u.id}:`, err);
    }
  }
};

export const AttendServices = {
  markAttendance,
  getTeacherAttendance,
  generateDailyAttendance,
  getStudentAttendance,
};
