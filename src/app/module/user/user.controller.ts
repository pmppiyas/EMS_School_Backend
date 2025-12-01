import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserStatus } from "./user.interface";
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

const createStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.createStudent(req);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Student create successfully",
      data: result,
    });
  }
);

const createAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.createAdmin(req);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Admin create successfully",
      data: result,
    });
  }
);

const createTeacher = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.createTeacher(req);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Teacher create successfully",
      data: result,
    });
  }
);

const changeUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.changeUserStatus(
      req.params.id,
      req.params.status.toUpperCase() as UserStatus
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `User ${req.params.status} successfully`,
      data: result,
    });
  }
);

export const UserController = {
  getAllUser,
  createStudent,
  createAdmin,
  createTeacher,
  changeUserStatus,
};
