import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ResultServices } from "./result.services";

const addResult = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ResultServices.addResult(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Result added successfully",
      data: result,
    });
  }
);

const getAllResults = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ResultServices.getAllResults();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All result retrieved successfully",
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
      message: "My result retrieved successfully",
      data: result,
    });
  }
);

const updateResult = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ResultServices.updateResult(req.params.id, req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Result updated successfully",
      data: result,
    });
  }
);

export const ResultController = {
  addResult,
  getAllResults,
  getMyResults,
  updateResult,
};
