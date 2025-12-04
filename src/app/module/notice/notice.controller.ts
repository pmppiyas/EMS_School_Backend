import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NoticeServices } from "./notice.services";

const createNotice = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await NoticeServices.createNotice(
      req.body,
      req.user?.id as string
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Notice created successfully",
      data: result,
    });
  }
);

const getNotices = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await NoticeServices.getNotices();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All notices retrieved successfully",
      data: result,
    });
  }
);

const getOneNotice = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await NoticeServices.getOneNotice(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Single notice retrieved successfully",
      data: result,
    });
  }
);

const updateNotice = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await NoticeServices.updateNotice(req.params.id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Notice update successfully",
      data: result,
    });
  }
);

const deleteNotice = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await NoticeServices.deleteNotice(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Notice deleted successfully",
      data: result,
    });
  }
);

export const NoticeController = {
  createNotice,
  getNotices,
  getOneNotice,
  updateNotice,
  deleteNotice,
};
