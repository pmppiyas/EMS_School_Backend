import prisma from '../../config/prisma';

const studentMeta = async (id: string) => {
  const data = await prisma.user.findUnique({
    where: {
      id,
    },

    include: {
      attendances: true,
      notices: true,

      student: true,
    },
  });
  return data;
};

const teacherMeta = async (id: string) => {
  return 'Ok';
};

export const MetaServices = {
  studentMeta,
  teacherMeta,
};
