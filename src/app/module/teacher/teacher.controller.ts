import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TeacherServices } from "./teacher.services";

const getAllTeachers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TeacherServices.allTeachers();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All teachers retrieved successfully",
      data: result,
    });
  }
);

export const TeacherController = {
  getAllTeachers,
};
