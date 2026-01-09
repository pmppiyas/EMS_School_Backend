import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { IUser } from '../user/user.interface';
import { AttendServices } from './attend.services';

const markAttendance = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AttendServices.markAttendance(
      req.body,
      req.user as IUser
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Attendance updated successfully',
      data: result,
    });
  }
);

const getTeacherAttendance = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AttendServices.getTeacherAttendance(
      req.query.date as string | undefined
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Teachers attendance retrieved successfully',
      data: result,
    });
  }
);

const getStudnetAttendance = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AttendServices.getStudentAttendance(
      req.query.classId as string | undefined,
      req.query.date as string | undefined
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Studnets attendance retrieved successfully',
      data: result,
    });
  }
);

export const AttendController = {
  markAttendance,
  getTeacherAttendance,
  getStudnetAttendance,
};
