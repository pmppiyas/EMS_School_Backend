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

const feesMeta = async () => {
  const now = new Date(); // Feb 15, 2026

  const startOfToday = new Date(now.setHours(0, 0, 0, 0));

  const lastWeek = new Date();
  lastWeek.setDate(now.getDate() - 7); // Feb 8, 2026

  const lastMonth = new Date();
  lastMonth.setDate(now.getDate() - 30); // Jan 16, 2026

  const [today, week, month] = await Promise.all([
    // Change "payment" to "feePayment" if that's where your data is
    prisma.feePayment.aggregate({
      where: { paidDate: { gte: startOfToday } },
      _sum: { paidAmount: true },
      _count: true,
    }),
    prisma.feePayment.aggregate({
      where: { paidDate: { gte: lastWeek } },
      _sum: { paidAmount: true },
      _count: true,
    }),
    prisma.feePayment.aggregate({
      where: { paidDate: { gte: lastMonth } },
      _sum: { paidAmount: true },
      _count: true,
    }),
  ]);

  return {
    today: { total: today._sum.paidAmount || 0, count: today._count },
    lastWeek: { total: week._sum.paidAmount || 0, count: week._count },
    lastMonth: { total: month._sum.paidAmount || 0, count: month._count },
  };
};

export const MetaServices = {
  studentMeta,
  teacherMeta,
  feesMeta,
};
