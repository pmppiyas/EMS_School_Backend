import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import {
  handleDuplicateError,
  handleZodValidatonError,
  validationError,
} from "../helper/errorHelper";
import { AppError } from "../utils/appError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = err.message || "Something went wrong";

  //Duplicate
  if (err.code === 11000 || err.expected) {
    const dupFunc = handleDuplicateError(err);
    statusCode = dupFunc.statusCode;
    message = dupFunc.message;
  }
  // Invalid Object ID Error
  else if (err.name === "CastError") {
    message = "Invalid MongoDB ObjectID. Please provide valid ID.";
  } else if (err.name === "ValidationError") {
    validationError(err);
  }

  //Zod Error
  if (err.name === "ZodError") {
    message = handleZodValidatonError(err).message;
    statusCode = handleZodValidatonError(err).statusCode;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    err,
    stack: env.NODE_ENV === "development" ? err.stack : null,
  });
};
