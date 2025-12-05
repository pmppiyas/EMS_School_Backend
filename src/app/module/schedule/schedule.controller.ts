import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ScheduleServices } from "./schedule.services";

const assignClassSchedule = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ScheduleServices.assignClassSchedule(req);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Schedule created successfully",
      data: result,
    });
  }
);

const getAllSchedules = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ScheduleServices.getAllSchedules(
      req.query.classId as string | undefined
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All schedules retrieved successfully",
      data: result,
    });
  }
);

const mySchedules = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const teacherEmail = req.user?.email as string;

    const result = await ScheduleServices.mySchedules(teacherEmail);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "My schedules successfully",
      data: result,
    });
  }
);

export const ScheduleController = {
  assignClassSchedule,
  getAllSchedules,
  mySchedules,
};
