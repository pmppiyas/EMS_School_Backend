import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import cron from 'node-cron';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import { AttendServices } from './app/module/attendance/attend.services';
import router from './app/routes/routes';
import { env } from './app/config/env';
import { adminSeed } from './app/utils/adminSeed';

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: [env.FRONTEND_LINK, 'http://localhost:3000'],
    credentials: true,
  })
);

app.use(express.json());
app.set('trust proxy', 1);
app.use(compression());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.send('Welcome to the EMS_School Server!');
});

app.use('/api/v1', router);

cron.schedule('0 8 * * *', () => {
  AttendServices.generateDailyAttendance();
});

// setInterval(() => {
//   AttendServices.generateDailyAttendance();
//   console.log('RUn');
// }, 5 * 1000);

adminSeed();

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route Not Found',
  });
});

app.use(globalErrorHandler);
export default app;
