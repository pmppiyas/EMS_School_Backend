import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.services";

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUser();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All user retrieved successfully",
      data: result,
    });
  }
);

export const UserController = {
  getAllUser,
};
