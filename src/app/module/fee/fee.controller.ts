import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FeeServices } from "./fee.services";

const createFeeType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await FeeServices.createFeeType(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Fee type created successfully",
      data: result,
    });
  }
);

const deleteFeeType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await FeeServices.deleteFeeType(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `${result} deleted successfully`,
      data: result,
    });
  }
);

export const FeeControllers = {
  createFeeType,
  deleteFeeType,
};
