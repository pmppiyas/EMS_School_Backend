import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StudentServices } from './student.services';
import { IUser } from '../user/user.interface';
import { userFilterableFields, userOptionFields } from './student.constant';
import queryPick from '../../utils/queryPick';

const allStudents = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = queryPick(req.query, userFilterableFields);
    const options = queryPick(req.query, userOptionFields);

    const { classId } = req.query;
    const result = await StudentServices.allStudents(
      classId as string,
      filters,
      options
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `All students retrieved successfully`,
      data: result,
    });
  }
);

const deleteStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StudentServices.deleteStudent(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Student successfully deleted`,
      data: result,
    });
  }
);

const updateStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StudentServices.updateStudent(
      req.params.id,
      req?.user as IUser,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Student successfully Updated`,
      data: result,
    });
  }
);

const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StudentServices.getById(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Single student retrieved successfully `,
      data: result,
    });
  }
);

export const StudentController = {
  allStudents,
  deleteStudent,
  updateStudent,
  getById,
};
