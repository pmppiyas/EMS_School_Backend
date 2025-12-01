import bcrypt from "bcryptjs";
import { env } from "../../config/env";
import prisma from "../../config/prisma";
import { createStudentInput } from "./user.interface";
const getAllUser = async () => {
  const user = await prisma.user.findMany();
  return user;
};

const createStudent = async (req: any) => {
  const salt = env.BCRYPT.SALTNUMBER;
  const {
    body,
    file,
  }: { body: createStudentInput; file?: Express.Multer.File } = req;

  console.log("Creating student with data:", body, "and file:", file);

  const hashPassword = await bcrypt.hash(body.password as string, Number(salt));

  const result = await prisma.$transaction(async (tnx) => {
    const user = await tnx.user.create({
      data: {
        email: body.email,
        password: hashPassword,
      },
    });

    return await tnx.student.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        address: body.address!,
        class: body.class,
        roll: body.roll,
        gender: body.gender!,
        dateOfBirth: body.dateOfBirth!,
        phoneNumber: body.phoneNumber!,
        userId: user.id,
      },
    });
  });
  return result;
};
export const UserServices = {
  getAllUser,
  createStudent,
};
