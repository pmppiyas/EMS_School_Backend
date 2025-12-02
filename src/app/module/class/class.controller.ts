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

const getClasses = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ClassServices.getClasses();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `All class retrieved successfully`,
      data: result,
    });
  }
);

const deleteClass = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ClassServices.deleteClass(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Class deleted successfully`,
      data: result,
    });
  }
);

const editClass = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ClassServices.editClass(req.params.id, req.body.name);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Class eidted successfully`,
      data: result,
    });
  }
);
export const ClassController = {
  createClass,
  getClasses,
  deleteClass,
  editClass,
};
