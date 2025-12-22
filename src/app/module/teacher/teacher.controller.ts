import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TeacherServices } from './teacher.services';

const getAllTeachers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TeacherServices.allTeachers();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'All teachers retrieved successfully',
      data: result,
    });
  }
);

const deleteTeacher = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TeacherServices.deleteTeacher(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Teacher deleted successfully',
      data: result,
    });
  }
);

const updateTeacher = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TeacherServices.updateTeacher(req.params.id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Teacher updated successfully',
      data: result,
    });
  }
);

const getTeacherById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TeacherServices.getById(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Single teacher retrieved successfully',
      data: result,
    });
  }
);

export const TeacherController = {
  getAllTeachers,
  deleteTeacher,
  updateTeacher,
  getTeacherById,
};
