import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '../interfaces/requestWIthUser.interface';
import { WrongTokenException } from '../exceptions/WrongToken.exception';
import {
  NoCookiesProvidedException
} from '../exceptions/NoCookiesProvided.exception';
import * as jwt from 'jsonwebtoken';
import { TokenPayload } from '../interfaces/token.interface';
import { userModel } from '../users/user.model';

export const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const cookies = req?.cookies;
    if (!cookies || !cookies?.Authorization) {
      return next(new NoCookiesProvidedException());
    }

    const { _id: id } = jwt.verify(cookies.Authorization, process.env.JWT_SECRET) as TokenPayload;

    const user = await userModel.findById(id);
    if (!user) {
      return next(new WrongTokenException());
    }

    req.user = user;
    next();
  } catch (e) {
    next(new WrongTokenException());
  }
}