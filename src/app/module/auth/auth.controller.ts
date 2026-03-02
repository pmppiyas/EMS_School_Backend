import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.services';
import { JwtPayload } from 'jsonwebtoken';

const crdLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthServices.crdLogin(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Credientials login successfully',
      data: result,
    });
  }
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userSession = req.cookies;
    const result = await AuthServices.getMe(userSession);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Self data retrived successfully',
      data: result,
    });
  }
);

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie('accessToken', {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    path: '/',
    maxAge: 0,
  });

  res.clearCookie('refreshToken', {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    path: '/',
  });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Logged out successfully',
    data: null,
  });
});

const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;

    const result = await AuthServices.refreshToken(refreshToken);

    res.cookie('accessToken', result.accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60,
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Refreash token retrieved successfully',
      data: {
        needPasswordChange: result.needPasswordChange,
      },
    });
  }
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authUser = req.user as JwtPayload;
    const { oldPassword, newPassword, targetUserId } = req.body;

    const userIdToUpdate = targetUserId || authUser.id;

    const result = await AuthServices.changePassWord(
      authUser,
      userIdToUpdate,
      oldPassword,
      newPassword
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Password updated successfully',
      data: result,
    });
  }
);

const changeEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authUser = req.user as JwtPayload;
    const { newEmail } = req.body;

    const result = await AuthServices.changeEmail(authUser, newEmail);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Email updated successfully',
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  }
);

export const AuthController = {
  crdLogin,
  getMe,
  logout,
  refreshToken,
  changePassword,
  changeEmail,
};
