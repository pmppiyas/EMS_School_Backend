import prisma from "../../config/prisma";

const getAllUser = async () => {
  const user = await prisma.user.findMany();
  return user;
};

export const UserServices = {
  getAllUser,
};
