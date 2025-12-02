import { Request } from "express";
import prisma from "../../config/prisma";
import { ISlot } from "./schedule.interface";

export const assignClassSchedule = async (req: Request) => {
  const { classId } = req.params;
  const {
    dayOfWeek,
    slots,
  }: {
    dayOfWeek: string;
    slots: ISlot[];
  } = req.body;

  await prisma.classSchedule.deleteMany({
    where: { classId, day: dayOfWeek },
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

export const ScheduleServices = {
  assignClassSchedule,
};
