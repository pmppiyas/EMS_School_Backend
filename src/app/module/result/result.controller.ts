import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ResultServices } from './result.services';

const uploadExelResult = catchAsync(async (req: Request, res: Response) => {
  const body = req.body.results;
  const { results, term, year } = body;

  if (!Array.isArray(results)) {
    throw new Error('Results must be an array');
  }

  const result = await ResultServices.uploadExcelResult({
    results,
    term,
    year,
  });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Result uploaded successfully',
    data: result,
  });
});

const addResult = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ResultServices.addResult(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Result added successfully',
      data: result,
    });
  }
);

const getAllResults = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ResultServices.getAllResults(
      req.params.id,
      req.query.term as string,
      Number(req.query.year)
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'All result retrieved successfully',
      data: result,
    });
  }
);

const getMyResults = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ResultServices.myResults(req.user?.email as string);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'My result retrieved successfully',
      data: result,
    });
  }
);

const updateResult = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ResultServices.updateResult(
      req.params.id,
      req.body.marks
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Result updated successfully',
      data: result,
    });
  }
);

export const ResultController = {
  uploadExelResult,
  addResult,
  getAllResults,
  getMyResults,
  updateResult,
};
