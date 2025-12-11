import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../config/prisma";
import { verifyToken } from "../helper/verifyToken";
import { AppError } from "../utils/appError";

export const checkAuth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const accessToken =
        req.cookies["accessToken"] || req.headers.authorization?.split(" ")[1];

      if (!accessToken) {
        throw new AppError(StatusCodes.FORBIDDEN, "No Token Received");
      }

      const decoded = verifyToken(accessToken);

      if (!roles.includes(decoded.role)) {
        throw new AppError(403, "You are not permitted for this route");
      }

      const isUserExist = await prisma.user.findUnique({
        where: {
          email: decoded.email,
          role: decoded.role,
        },
      });

      if (!isUserExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist");
      }

      if (isUserExist.status === "SUSPENDED") {
        throw new AppError(StatusCodes.BAD_REQUEST, "User is suspended");
      }

      req.user = decoded;
      next();
    } catch (err) {
      next(err);
    }
  };
};
