import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/http.exception';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import * as jwt from 'jsonwebtoken';
import { DataStoredInToken } from '../interfaces/jwt.interface';
import { AppDataSource } from '../data-source';
import { User } from '../users/user.entity';

export const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const { id } = jwt.verify(token, process.env.JWT_SECRET) as DataStoredInToken;

    if (!id) {
      return next(new HttpException(403, 'Wrong Token'));
    }

    const usersRepo = AppDataSource.getRepository(User);
    const foundUser = await usersRepo.findOne({ where: { id: Number(id) } });
    if (!foundUser) {
      return next(new HttpException(403, 'Not authorized'));
    }

    delete foundUser.password;
    req.user = foundUser;
    next();
  } catch (e) {
    next(new HttpException(403, 'Not authorized'));
  }
}