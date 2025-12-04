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

const getAllResults = async () => {
  return await prisma.result.findMany();
};

const myResults = async (email: string) => {
  const student = await prisma.student.findUniqueOrThrow({
    where: {
      email,
    },
  });
  if (!student) {
    throw new AppError(StatusCodes.NOT_FOUND, "Student not found");
  }

  const results = await prisma.result.findMany({
    where: {
      studentId: student.id,
    },
    select: {
      subject: {
        select: {
          name: true,
          code: true,
        },
      },
      marks: true,
      grade: true,
      term: true,
      year: true,
    },
  });

  const grouped = results.reduce((acc, item) => {
    const year = item.year;
    const term = item.term;

    if (!acc[year]) acc[year] = {};
    if (!acc[year][term]) acc[year][term] = [];

    acc[year][term].push({
      subject: item.subject,
      marks: item.marks,
      grade: item.grade,
    });

    return acc;
  }, {} as Record<string, Record<string, any[]>>);

  return grouped;
};

export const ResultServices = {
  addResult,
  getAllResults,
  myResults,
};
