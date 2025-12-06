import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { env } from "../../config/env";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IUser } from "../user/user.interface";
import { PaymentService } from "./payment.services";

const paymentInit = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await PaymentService.paymentInit(
      req.body,
      req.user as IUser
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Payment init successfully",
      data: result,
    });
  }
);

const successPayment = catchAsync(async (req, res) => {
  const result = await PaymentService.successPayment(
    req.query as Record<string, string>
  );

  if (result.count > 0) {
    res.redirect(env.SSL.SUCCESS_FRONTEND_URL);
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Payment success updated",
    data: result,
  });
});

const failPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await PaymentService.failPayment(
      req.query as Record<string, string>
    );
    if (result.count > 0) {
      res.redirect(env.SSL.FAIL_FRONTEND_URL);
    }
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Payment Failed",
      data: result,
    });
  }
);

const cancelPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await PaymentService.cancelPayment(
      req.query as Record<string, string>
    );

    if (result.count > 0) {
      res.redirect(env.SSL.CANCEL_FRONTEND_URL);
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Payment canceled",
      data: result,
    });
  }
);

export const PaymentController = {
  paymentInit,
  successPayment,
  failPayment,
  cancelPayment,
};
