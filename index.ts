import { prisma } from "./src/app/config/prisma";

async function main() {
  const user = await prisma.users.findMany();
  console.log("Users=>", user);
}

main();
