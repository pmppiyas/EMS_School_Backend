import prisma from "../../config/prisma";

const allTeachers = async () => {
  const teachers = await prisma.teacher.findMany();
  const total = await prisma.teacher.count();
  return {
    teachers,
    meta: {
      total,
    },
  };
};

export const TeacherServices = {
  allTeachers,
};
