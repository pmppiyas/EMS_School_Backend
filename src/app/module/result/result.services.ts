import { StatusCodes } from 'http-status-codes';
import prisma from '../../config/prisma';
import { AppError } from '../../utils/appError';
import { calculateGrade } from '../../utils/claculateGrade';
import { resultFormation } from '../../utils/resultFormation';
import { AddResultBody } from './result.interface';

const uploadExcelResult = async ({
  results,
  term,
  year,
}: {
  results: any[];
  term: string;
  year: number;
}) => {
  return await prisma.$transaction(
    results.map((item) => {
      return prisma.result.upsert({
        where: {
          studentId_subjectId_term_year: {
            studentId: item.studentId,
            subjectId: item.subjectId,
            term,
            year,
          },
        },
        update: {
          marks: Number(item.marks),
          grade: calculateGrade(Number(item.marks)),
        },
        create: {
          studentId: item.studentId,
          subjectId: item.subjectId,
          classId: item.classId,
          marks: Number(item.marks),
          grade: calculateGrade(Number(item.marks)),
          term,
          year,
        },
      });
    })
  );
};

const addResult = async (payload: AddResultBody) => {
  const { studentId, subjectId, marks, term, year } = payload;

  const grade = calculateGrade(marks);

  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student?.classId) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Student not found!');
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

const getAllResults = async (classId: string, term: string, year: number) => {
  const results = await prisma.result.findMany({
    where: {
      classId,
      term,
      year,
    },
    select: {
      studentId: true,
      student: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          class: {
            select: { name: true },
          },
        },
      },
      subject: {
        select: { name: true, code: true },
      },
      marks: true,
      grade: true,
      term: true,
      year: true,
    },
  });

  return resultFormation(results);
};

const myResults = async (email: string) => {
  const student = await prisma.student.findUniqueOrThrow({
    where: {
      email,
    },
  });
  if (!student) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Student not found');
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

const updateResult = async (resultId: string, marks: number) => {
  const existing = await prisma.result.findUnique({
    where: { id: resultId },
  });

  if (!existing) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Result not found!');
  }

  const data: Record<string, unknown> = {};

  if (marks !== undefined) {
    if (marks > 100) {
      throw new AppError(StatusCodes.NOT_MODIFIED, 'Highest mark is 100');
    } else if (marks < 0) {
      throw new AppError(StatusCodes.NOT_MODIFIED, 'Minimum mark is 00');
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
  uploadExcelResult,
  addResult,
  getAllResults,
  myResults,
  updateResult,
};
