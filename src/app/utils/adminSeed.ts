import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import prisma from '../config/prisma';

export const adminSeed = async () => {
  const adminData = {
    firstName: 'Admin',
    lastName: 'Vai',
    email: env.ADMINSEED.EMAIL,
    password: env.ADMINSEED.PASSWORD,
    phoneNumber: '01712345678',
    address: 'Rangpur, Bangladesh',
    gender: 'MALE',
    designation: 'Head Admin',
  };

  try {
    const isExist = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (isExist) {
      console.log('✔ Admin user already exists. Skipping seed.');
      return;
    }

    const salt = env.BCRYPT?.SALTNUMBER || 10;
    const hashedPassword = await bcrypt.hash(adminData.password, Number(salt));

    const result = await prisma.$transaction(async (tnx) => {
      const newUser = await tnx.user.create({
        data: {
          email: adminData.email,
          password: hashedPassword,
          role: 'ADMIN',
        },
      });

      const newAdmin = await tnx.admin.create({
        data: {
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          email: adminData.email,
          phoneNumber: adminData.phoneNumber,
          gender: adminData.gender as any,
          designation: adminData.designation,
          address: adminData.address,
          userId: newUser.id,
        },
      });

      return { newUser, newAdmin };
    });

    console.log('🚀 Admin Seeded Successfully:', result.newAdmin.email);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  }
};
