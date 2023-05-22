import { Response, NextFunction } from 'express';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationToken.exception';
import * as jwt from 'jsonwebtoken';
import PgDataSource from '../pg-data-source';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import User from '../user/user.entity';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { Authorization } = req.cookies;
  const userRepo = PgDataSource.getRepository(User);
  try {
    const tokenData = jwt.verify(Authorization, process.env.JWT_SECRET) as DataStoredInToken;

    const user = await userRepo.findOneBy({ id: tokenData.id });
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