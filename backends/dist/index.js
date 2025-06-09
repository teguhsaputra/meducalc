"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const schema1_1 = __importDefault(require("./routes/schema1"));
dotenv_1.default.config();
console.log("DATABASE_URL_SCHEMA1", process.env.DATABASE_URL_SCHEMA1);
const app = (0, express_1.default)();
const port = 3006;
const corsConfig = {
    origin: [
        "http://localhost:3005",
        "https://meducalc.rftdigitalsolution.com",
        "https://meducalc-api.rftdigitalsolution.com",
        "http://localhost:3000",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
app.use((0, cors_1.default)(corsConfig));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/", schema1_1.default);
app.listen(port, () => {
    console.log(`⚡️ Server is running at http://localhost:${port}`);
});
exports.default = app;
