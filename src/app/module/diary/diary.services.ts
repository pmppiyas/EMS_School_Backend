import { Prisma } from '@prisma/client';
import prisma from '../../config/prisma';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../utils/appError';

const createDiary = async (payload: any) => {
  const formattedDate = new Date(payload.date);

  if (isNaN(formattedDate.getTime())) {
    throw new Error('The provided date is invalid.');
  }

  const create = await prisma.diary.create({
    data: {
      note: payload.note,
      date: formattedDate,
      comment: payload.comment || null,

      class: { connect: { id: payload.classId } },
      period: { connect: { id: payload.periodId } },

      ...(payload.subjectId && {
        subject: { connect: { id: payload.subjectId } },
      }),
      ...(payload.teacherId && {
        teacher: { connect: { id: payload.teacherId } },
      }),
    },
  });

  return create;
};

const updateDiary = async (id: string, payload: any) => {
  const isExist = await prisma.diary.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Diary record not found!');
  }

  if (payload.date) {
    payload.date = new Date(payload.date);
  }

  const result = await prisma.diary.update({
    where: { id },
    data: payload,
  });

  return result;
};
const deleteDiary = async (id: string) => {
  const isExist = await prisma.diary.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Diary record not found!');
  }

  return await prisma.diary.delete({
    where: {
      id,
    },
  });
};

const readDiary = async (classId: string, date: string) => {
  const dayName = new Date(date)
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toUpperCase();

  const startOfDay = new Date(`${date}T00:00:00.000Z`);
  const endOfDay = new Date(`${date}T23:59:59.999Z`);

  const allPeriods = await prisma.classTime.findMany({
    orderBy: { startTime: 'asc' },
  });

  const existClass = await prisma.class.findFirst({
    where: {
      id: classId,
    },
  });

  if (!existClass) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Class not found');
  }

  const classSchedules = await prisma.classSchedule.findMany({
    where: {
      classId: classId,
      day: dayName,
    },
    include: {
      subject: true,
      teacher: true,
    },
  });

  const diaryEntries = await prisma.diary.findMany({
    where: {
      classId: classId,
      date: { gte: startOfDay, lte: endOfDay },
    },
  });

  const completeDiary = allPeriods.map((period) => {
    const schedule = classSchedules.find((s) => s.classTimeId === period.id);

    const entry = diaryEntries.find((d) => d.periodId === period.id);

    return {
      classId,
      periodId: period.id,
      periodName: period.period,
      startTime: period.startTime,

      subjectName: schedule?.subject?.name || 'No Subject',
      teacherName: schedule?.teacher
        ? `${schedule.teacher.firstName} ${schedule.teacher.lastName || ''}`
        : 'N/A',
      note: entry?.note || '',
      comment: entry?.comment || '',
      isEntryExist: !!entry,
      diaryId: entry?.id || null,
      subjectId: schedule?.subjectId || null,
      teacherId: schedule?.teacherId || null,
    };
  });

  const sortedDiary = completeDiary.sort((a, b) => {
    return Number(a.periodName) - Number(b.periodName);
  });

  return {
    date,
    class: existClass.name,
    day: dayName,
    diary: sortedDiary,
  };
};

export const DiaryServices = {
  createDiary,
  updateDiary,
  deleteDiary,
  readDiary,
};
