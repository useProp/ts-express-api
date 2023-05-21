import { Response, NextFunction } from 'express';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationToken.exception';
import * as jwt from 'jsonwebtoken';
import userModel from '../users/user.model';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { Authorization } = req.cookies;
  try {
    const tokenData = jwt.verify(Authorization, process.env.JWT_SECRET) as DataStoredInToken;

    const user = await userModel.findById(tokenData._id);
    if (!user) {
      return next(new WrongAuthenticationTokenException());
    }

    req.user = user;

    next();
  } catch (e) {
    next(new WrongAuthenticationTokenException());
  }
}

export default authMiddleware;