import catchAsync from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import { DieryServices } from './diery.services';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createDiery = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await DieryServices.createDiery(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Diery upload succcessfully',
      data: result,
    });
  }
);

const updateDiery = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await DieryServices.updateDiery(req.params.id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Diery update succcessfully',
      data: result,
    });
  }
);

const deleteDiery = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await DieryServices.deleteDiery(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Diery delete succcessfully',
      data: result,
    });
  }
);

const readDiery = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const date =
      (req.query.date as string) || new Date().toISOString().split('T')[0];

    const result = await DieryServices.readDiery(req.params.id, date);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Diary fetched successfully',
      data: result,
    });
  }
);

export const DieryController = {
  createDiery,
  updateDiery,
  deleteDiery,
  readDiery,
};
