"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema1_1 = require("../prisma/generated/schema1");
let prisma;
if (process.env.NODE_ENV === "production") {
    prisma = new schema1_1.PrismaClient();
}
else {
    if (!global.prisma) {
        global.prisma = new schema1_1.PrismaClient();
    }
    prisma = global.prisma;
}
exports.default = prisma;
