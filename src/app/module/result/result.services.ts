import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { calculateGrade } from "../../utils/claculateGrade";
import { AddResultBody } from "./result.interface";

const addResult = async (payload: AddResultBody) => {
  const { studentId, subjectId, marks, term, year } = payload;

  const grade = calculateGrade(marks);

  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student?.classId) {
    throw new AppError(StatusCodes.NOT_FOUND, "Student not found!");
  }

  const result = await prisma.result.upsert({
    where: {
      studentId_subjectId_term_year: {
        studentId,
        subjectId,
        term,
        year,
      },
    },
    update: { marks, grade },
    create: {
      studentId,
      classId: student.classId,
      subjectId,
      marks,
      grade,
      term,
      year,
    },
  });

  return result;
};

export const ResultServices = {
  addResult,
};
