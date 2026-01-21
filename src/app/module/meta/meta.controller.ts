import catchAsync from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { MetaServices } from './meta.services';

const studentMeta = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await MetaServices.studentMeta(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Student retrieved successfully `,
      data: result,
    });
  }
);

const teacherMeta = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await MetaServices.teacherMeta(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Student retrieved successfully `,
      data: result,
    });
  }
);

export const MetaController = {
  studentMeta,
  teacherMeta,
};
