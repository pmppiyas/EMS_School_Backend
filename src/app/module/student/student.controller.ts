import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StudentServices } from "./student.services";

const myFee = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StudentServices.myFee(req.user?.email as string);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `My fees retrieved successfully`,
      data: result,
    });
  }
);

export const StudentController = {
  myFee,
};
