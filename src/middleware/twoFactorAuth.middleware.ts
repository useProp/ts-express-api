import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import { NextFunction, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { HttpException } from '../exceptions/http.exception';

export const twoFactorAuthMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { user } = req;
  const { token } = req.body;

  if (!user.isTwoFactorAuthEnabled) {
    next();
  }

  const authService = new AuthService();
  const isTokenValid = authService.verify2FAToken(token, user.twoFactorAuthCode);
  if (!isTokenValid) {
    return next(new HttpException(403, 'Wrong Token'));
  }

  delete user.isTwoFactorAuthEnabled;
  delete user.twoFactorAuthCode

  console.log(req.user)
  next();
}