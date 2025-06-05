import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import route from "./routes/schema1";

dotenv.config();

console.log("DATABASE_URL_SCHEMA1", process.env.DATABASE_URL_SCHEMA1);

const app: Express = express();
const port = 3006;
const corsConfig: object = {
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

app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/", route);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
