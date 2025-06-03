import bcrypt from "bcrypt";
import { PrismaClient } from "../src/lib/prisma/generated/schema1";

const prisma = new PrismaClient();
const saltRounds = 10;

async function main() {
  const hashedAdminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD as string,
    saltRounds
  );

  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      id: 1,
      username: "admin",
      password: hashedAdminPassword,
    },
  });
}

main()
  .then(() => console.log("Seed data successfully created"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect;
  });
