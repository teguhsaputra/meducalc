import { PrismaClient } from "../prisma/generated/schema2";

let prismaMysql: PrismaClient;

declare global {
  var prismaMysql: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  prismaMysql = new PrismaClient();
} else {
  if (!global.prismaMysql) {
    global.prismaMysql = new PrismaClient();
  }
  prismaMysql = global.prismaMysql;
}

export default prismaMysql;
