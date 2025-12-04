import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { calculateGrade } from "../../utils/claculateGrade";
import { resultFormation } from "../../utils/resultFormation";
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
  const results = await prisma.result.findMany({
    select: {
      student: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          class: {
            select: {
              name: true,
            },
          },
        },
      },
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

  return await resultFormation(results);
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
      student: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          class: {
            select: {
              name: true,
            },
          },
        },
      },
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

  return await resultFormation(results);
};

interface UpdateResultPayload {
  marks?: number;
  subjectId?: string;
  term?: string;
  year?: number;
}

const updateResult = async (resultId: string, payload: UpdateResultPayload) => {
  const { marks, subjectId, term, year } = payload;

  const existing = await prisma.result.findUnique({
    where: { id: resultId },
  });

  if (!existing) {
    throw new AppError(StatusCodes.NOT_FOUND, "Result not found!");
  }

  const data: Record<string, unknown> = {};

  if (marks !== undefined) {
    if (marks > 100) {
      throw new AppError(StatusCodes.NOT_MODIFIED, "Highest mark is 100");
    } else if (marks < 0) {
      throw new AppError(StatusCodes.NOT_MODIFIED, "Minimum mark is 00");
    }
    data.marks = marks;
    data.grade = calculateGrade(marks);
  }

  const updated = await prisma.result.update({
    where: { id: resultId },
    data,
    select: {
      marks: true,
      grade: true,
      subject: {
        select: {
          name: true,
        },
      },
    },
  });

  return updated;
};

export const ResultServices = {
  addResult,
  getAllResults,
  myResults,
  updateResult,
};
