import { Request } from "express";
import prisma from "../../config/prisma";
import { ISlot } from "./schedule.interface";

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

const getAllSchedules = async () => {
  const total = await prisma.classSchedule.count();
  const schedules = await prisma.classSchedule.findMany({
    include: {
      classTime: true,
      teacher: true,
      subject: true,
      class: true,
    },
    orderBy: [{ day: "asc" }, { classTime: { startTime: "asc" } }],
  });

  return {
    schedules,
    meta: {
      total,
    },
  };
};

export const ScheduleServices = {
  assignClassSchedule,
  getAllSchedules,
};
