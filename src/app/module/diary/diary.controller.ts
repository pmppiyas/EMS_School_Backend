import catchAsync from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import { DiaryServices } from './diary.services';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createDiary = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await DiaryServices.createDiary(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Diary upload succcessfully',
      data: result,
    });
  }
);

const updateDiary = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await DiaryServices.updateDiary(req.params.id, req.body);
    console.log(result);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Diary update succcessfully',
      data: result,
    });
  }
);

const deleteDiary = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await DiaryServices.deleteDiary(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Diary delete succcessfully',
      data: result,
    });
  }
);

const readDiary = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bdToday = new Date().toLocaleDateString('en-CA', {
      timeZone: 'Asia/Dhaka',
    });

    const date = (req.query.date as string) || bdToday;

    const result = await DiaryServices.readDiary(req.params.id, date);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Diary fetched successfully',
      data: result,
    });
  }
);

export const DiaryController = {
  createDiary,
  updateDiary,
  deleteDiary,
  readDiary,
};
