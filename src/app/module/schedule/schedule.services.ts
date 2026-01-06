import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../config/prisma';
import { groupAndSortSchedules } from '../../helper/scheduleHelper';
import { AppError } from '../../utils/appError';
import { ISlot } from './schedule.interface';
import { tr } from 'zod/locales';

const assignClassSchedule = async (req: Request) => {
  const { classId } = req.params;
  const { dayOfWeek, slots }: { dayOfWeek: string; slots: ISlot[] } = req.body;

  const classTimeIds = slots.map((s) => s.classTimeId);

  await prisma.classSchedule.deleteMany({
    where: {
      classId,
      day: dayOfWeek,
      classTimeId: { in: classTimeIds },
    },
  });

  const data = slots.map((s) => ({
    classId,
    day: dayOfWeek,
    classTimeId: s.classTimeId,
    teacherId: s.teacherId,
    subjectId: s.subjectId,
  }));

  return await prisma.classSchedule.createMany({ data });
};

const getAllSchedules = async (day?: string) => {
  const where = day ? { day } : {};
  const schedules = await prisma.classSchedule.findMany({
    where,
    include: {
      classTime: {
        select: { period: true, startTime: true, endTime: true },
      },
      teacher: {
        select: {
          firstName: true,
          lastName: true,
          designation: true,
          gender: true,
          phoneNumber: true,
        },
      },
      subject: {
        select: {
          name: true,
          code: true,
        },
      },
    },
  });

  return groupAndSortSchedules(schedules);
};

const mySchedules = async (email: string) => {
  const teacher = await prisma.teacher.findUnique({
    where: { email },
  });

  if (!teacher) {
    throw new AppError(StatusCodes.FORBIDDEN, 'You are not authorized!');
  }

  const schedules = await prisma.classSchedule.findMany({
    where: { teacherId: teacher.id },
    include: {
      class: { select: { name: true } },
      subject: { select: { name: true } },
      classTime: {
        select: { period: true, startTime: true, endTime: true },
      },
    },
  });

  return groupAndSortSchedules(schedules);
};

const getScheduleByDay = async (day: string) => {
  const schedules = await prisma.classSchedule.findMany({
    where: {
      day,
    },
    include: {
      classTime: {
        select: { period: true, startTime: true, endTime: true },
      },
      teacher: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true,
        },
      },
      subject: {
        select: {
          name: true,
          code: true,
        },
      },
      class: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  const groupedByClass = schedules.reduce((acc, schedule) => {
    const classId = schedule.class.id;

    if (!acc[classId]) {
      acc[classId] = {
        class: schedule.class,
        schedules: [],
      };
    }

    acc[classId].schedules.push({
      classTime: schedule.classTime,
      teacher: schedule.teacher,
      subject: schedule.subject,
    });

    return acc;
  }, {} as Record<string, any>);

  return Object.values(groupedByClass);
};

export const ScheduleServices = {
  assignClassSchedule,
  getAllSchedules,
  mySchedules,
  getScheduleByDay,
};
