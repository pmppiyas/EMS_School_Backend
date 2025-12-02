import { Request } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";

export const assignClassSchedule = async (req: Request) => {
  const { classId } = req.params;
  const { dayOfWeek, slots } = req.body;

  // Extract all subjectIds & teacherIds
  const subjectIds = slots.map((s) => s.subjectId);
  const teacherIds = slots.map((s) => s.teacherId);
  const classTimeIds = slots.map((s) => s.classTimeId);
  console.log("subjectIds=>> ", subjectIds);
  console.log("Teacher Ids=> ", teacherIds);
  console.log("ClassTimesIds=>>>", classTimeIds);

  // -----------------------------------
  // 🔥 1. SUBJECT VALIDATION
  // -----------------------------------
  const allowedSubjects = await prisma.subject.findMany({
    where: { id: classId },
    select: { id: true },
  });

  const allowedSubjectIds = allowedSubjects.map((s) => s.id);

  const invalidSubjects = subjectIds.filter(
    (id) => !allowedSubjectIds.includes(id)
  );

  if (invalidSubjects.length > 0) {
    return res.status(400).json({
      message: "Some subjects are not assigned to this class.",
      invalidSubjects,
    });
  }

  // -----------------------------------
  // 🔥 2. TEACHER DOUBLE-BOOK CHECK
  // -----------------------------------
  const existingBookings = await prisma.classSchedule.findMany({
    where: {
      day: dayOfWeek,
      classTimeId: { in: classTimeIds },
      teacherId: { in: teacherIds },
    },
  });

  if (existingBookings.length > 0) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "Some teachers are already booked for those time slots."
    );
  }

  // -----------------------------------
  // 🔥 3. REMOVE OLD SCHEDULE FOR THAT DAY
  // -----------------------------------
  await prisma.classSchedule.deleteMany({
    where: { classId, day: dayOfWeek },
  });

  // -----------------------------------
  // 🔥 4. INSERT NEW SCHEDULE
  // -----------------------------------
  const data = slots.map((s) => ({
    classId,
    dayOfWeek,
    classTimeId: s.classTimeId,
    teacherId: s.teacherId,
    subjectId: s.subjectId,
  }));

  return await prisma.classSchedule.createMany({ data });
};

export const ScheduleServices = {
  assignClassSchedule,
};
