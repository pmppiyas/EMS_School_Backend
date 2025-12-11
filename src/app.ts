import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import cron from "node-cron";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { AttendServices } from "./app/module/attendance/attend.services";
import router from "./app/routes/routes";

const app = express();

app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (_req, res) => {
  res.send("Welcome to the EMS_School Server!");
});

app.use("/api/v1", router);

cron.schedule("0 8 * * *", () => {
  AttendServices.generateDailyAttendance();
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

app.use(globalErrorHandler);
export default app;
