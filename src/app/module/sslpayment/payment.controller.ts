import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.services";

const paymentInit = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await PaymentService.paymentInit(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Payment successfully",
      data: result,
    });
  }
);

export const PaymentController = {
  paymentInit,
};
