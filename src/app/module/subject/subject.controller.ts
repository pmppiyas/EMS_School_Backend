import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SubjectServices } from "./subject.services";

const createSubject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await SubjectServices.createSubject(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Subject added successfully`,
      data: result,
    });
  }
);

const getAllSubjects = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await SubjectServices.getAllSubjects();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `All subjects successfully`,
      data: result,
    });
  }
);

const editSubject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await SubjectServices.editSubject(req.params.id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Subject edited successfully`,
      data: result,
    });
  }
);

const deleteSubject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await SubjectServices.deleteSubject(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `${result} deleted successfully`,
      data: result,
    });
  }
);

export const SubjectController = {
  createSubject,
  getAllSubjects,
  editSubject,
  deleteSubject,
};
