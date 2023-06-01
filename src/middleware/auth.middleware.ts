import { Response, NextFunction, RequestHandler } from 'express';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationToken.exception';
import * as jwt from 'jsonwebtoken';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import UserService from '../user/user.service';

const authMiddleware = (isTwoFactorEnabled = true): RequestHandler => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { Authorization } = req.cookies;
      const userService = new UserService();
      const { id, isTwoFactorAuthenticated } = jwt.verify(Authorization, process.env.JWT_SECRET) as DataStoredInToken;

      const user = await userService.getOne({ _id: id });
      if (!user) {
        return next(new WrongAuthenticationTokenException());
      }

      if (isTwoFactorEnabled && user.isTwoFactorAuthenticationEnabled && !isTwoFactorAuthenticated) {
        return next(new WrongAuthenticationTokenException());
      }

      req.user = user;

      next();
    } catch (e) {
      next(new WrongAuthenticationTokenException());
    }
  }
}

export default authMiddleware;