import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserStatus } from "../user/user.interface";
import { UserServices } from "../user/user.services";
import { ClassServices } from "./class.services";

const createClass = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ClassServices.createClass(req.body.name);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Class created successfully`,
      data: result,
    });
  }
);

export const ClassController = {
  createClass,
};
