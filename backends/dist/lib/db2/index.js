"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema2_1 = require("../prisma/generated/schema2");
let prismaMysql;
if (process.env.NODE_ENV === "production") {
    prismaMysql = new schema2_1.PrismaClient();
}
else {
    if (!global.prismaMysql) {
        global.prismaMysql = new schema2_1.PrismaClient();
    }
    prismaMysql = global.prismaMysql;
}
exports.default = prismaMysql;
