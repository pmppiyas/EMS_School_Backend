import { get } from 'http';
import prisma from '../../config/prisma';
import { IUser, Role } from '../user/user.interface';
import { Gender, Prisma } from '@prisma/client';
import { AppError } from '../../utils/appError';
import httpStatus from 'http-status-codes';
import { IOptions } from './student.interface';
import { calculatePagination } from '../../utils/calculatePagination';

const allStudents = async (
  classId?: string,
  params?: any,
  options?: IOptions
) => {
  const { page, limit, skip, sortOrder, sortBy } = calculatePagination(
    options as IOptions
  );

  const { searchTerm } = params || {};

  const effectivePage = searchTerm ? 1 : page;
  const effectiveSkip = searchTerm ? 0 : skip;

  const andConditions: Prisma.StudentWhereInput[] = [];

  if (searchTerm) {
    const orConditions: Prisma.StudentWhereInput[] = [
      {
        firstName: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      {
        lastName: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
    ];

    if (!isNaN(Number(searchTerm))) {
      orConditions.push({
        roll: Number(searchTerm),
      });
    }

    andConditions.push({ OR: orConditions });
  }

  let className = 'All Classes';

  if (classId) {
    const existClass = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!existClass) {
      throw new AppError(httpStatus.NOT_FOUND, 'Class not found');
    }

    className = existClass.name;
    andConditions.push({ classId });
  }

  const whereConditions: Prisma.StudentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orderBy: Prisma.StudentOrderByWithRelationInput =
    sortBy && sortOrder
      ? { [sortBy]: sortOrder as Prisma.SortOrder }
      : { roll: Prisma.SortOrder.asc };

  const students = await prisma.student.findMany({
    where: whereConditions,
    skip: effectiveSkip,
    take: limit,
    orderBy,
    include: {
      class: {
        select: { id: true, name: true },
      },

      user: {
        select: {
          attendances: true,
          status: true,
          needPasswordChange: true,
        },
      },
    },
  });

  const intotal = await prisma.student.count({
    where: whereConditions,
    skip: effectiveSkip,
    take: limit,
  });
  const total = await prisma.student.count({
    where: whereConditions,
  });

  return {
    students,
    meta: {
      page: effectivePage,
      limit,
      intotal,
      total,
      className,
    },
  };
};

const deleteStudent = async (id: string) => {
  const studnet = await prisma.student.delete({
    where: {
      id,
    },
  });

  return studnet;
};

const updateStudent = async (
  id: string,
  currentUser: IUser,
  payload: Record<string, any>
) => {
  if (currentUser.role === Role.STUDENT) {
    const ownStudent = await prisma.student.findUnique({
      where: { userId: currentUser.id },
    });

    if (!ownStudent || ownStudent.id !== id) {
      throw new Error('Unauthorized');
    }

    const allowedFields = [
      'firstName',
      'lastName',
      'gender',
      'address',
      'dateOfBirth',
      'phoneNumber',
      'photoUrl',
      'photoPublicId',
    ];

    payload = Object.fromEntries(
      Object.entries(payload).filter(([key]) => allowedFields.includes(key))
    );
  }

  if (payload.roll !== undefined) {
    const roll = Number(payload.roll);
    if (isNaN(roll)) throw new Error('Roll must be a number');
    payload.roll = roll;
  }

  if (payload.dateOfBirth) {
    payload.dateOfBirth = new Date(payload.dateOfBirth);
  }

  if (payload.classId) {
    payload.class = {
      connect: { id: payload.classId },
    };
    delete payload.classId;
  }
  if (payload.photoUrl) {
    payload.photo = payload.photoUrl;
  }

  if (Object.keys(payload).length === 0) {
    throw new Error('No valid data to update');
  }

  return await prisma.student.update({
    where: { id },
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      roll: Number(payload.roll),
      gender: payload.gender as Gender,
      phoneNumber: payload.phoneNumber || null,
      address: payload.address || null,
      photo: payload.photoUrl || null,
      dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : null,
      class: payload.class || undefined,
    },
  });
};

const getById = async (id: string) => {
  return await prisma.student.findFirst({
    where: { id },
  });
};
export const StudentServices = {
  allStudents,
  deleteStudent,
  updateStudent,
  getById,
};
