import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IUser } from "../user/user.interface";
import { AttendServices } from "./attend.services";

const markAttendance = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AttendServices.markAttendance(
      req.body,
      req.user as IUser
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Attendance create successfully",
      data: result,
    });
  }
);

const getAttendance = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AttendServices.getAttendance(
      req.body.classId,
      req.user as IUser
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Attendance retrieved successfully",
      data: result,
    });
  }
);

export const AttendController = {
  markAttendance,
  getAttendance,
};
