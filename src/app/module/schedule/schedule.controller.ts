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

export const ScheduleController = {
  assignClassSchedule,
};
