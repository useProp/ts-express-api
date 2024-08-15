import { Controller } from '../interfaces/controller.interface';
import { NextFunction, Router, Request, Response } from 'express';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreateUserDto } from '../users/user.dto';
import { LoginDto } from './login.dto';
import { User } from '../users/user.interface';
import { userModel } from '../users/user.model';
import { UserEmailOccupated } from '../exceptions/UserEmailOccupated.exception';
import * as bcrypt from 'bcrypt';
import { ServerException } from '../exceptions/Server.exception';
import { WrongCredentials } from '../exceptions/WrongCredentials.exception';
import * as jwt from 'jsonwebtoken';
import { TokenData, TokenPayload } from '../interfaces/token.interface';
import { JwtSignException } from '../exceptions/JwtSignException.exception';

export class AuthenticationController implements Controller {
  public router = Router();
  public path = '/auth';
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.register);
    this.router.post(`${this.path}/login`, validationMiddleware(LoginDto), this.login);
    this.router.get(`${this.path}/logout`, this.logout);
  }

  private register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;

      const isEmailAvailable = await this.user.findOne({ email: userData.email });
      if (isEmailAvailable) {
        return next(new UserEmailOccupated(userData.email));
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const newUser = await this.user.create({
        ...userData,
        password: hashedPassword
      });

      newUser.password = undefined;

      const token = this.createToken(newUser.id);

      res.setHeader('Set-Cookie', [this.createCookie(token)]);
      res.json({ user: newUser, token });
    } catch (e) {
      console.log('register', e);
      next(new ServerException());
    }
  }

  private login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: LoginDto = req.body;

      const user = await this.user.findOne({ email: userData.email });
      if (!user) {
        return next(new WrongCredentials());
      }

      const isPasswordValid = await bcrypt.compare(userData.password, user.password);
      if (!isPasswordValid) {
        return next(new WrongCredentials());
      }

      user.password = undefined;

      const token = this.createToken(user.id);
      res.setHeader('Set-Cookie', [this.createCookie(token)]);

      res.json({ user, token });
    } catch (e) {
      console.log('login', e);
      next(new ServerException());
    }
  }


  private createToken(id: string): TokenData {
    try {
      const expiresIn = 60 * 60;
      const payload: TokenPayload = {
        _id: id,
      }
      return {
        expiresIn,
        token: jwt.sign(payload, process.env.JWT_SECRET, { expiresIn }),
      }
    } catch (e) {
      throw new JwtSignException();
    }
  }

  private createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  private logout = (req: Request, res: Response) => {
    res.setHeader('Set-Cookie', ['Authorization=;Max-Age=0']);
    res.json({ message: 'OK' });
  }

}