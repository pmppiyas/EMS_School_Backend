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

export const ResultController = {
  addResult,
};
