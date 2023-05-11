import Controller from '../interfaces/controller.interface';
import { NextFunction, Request, Response, Router } from 'express';
import userModel from '../users/user.model';
import validationMiddleware from '../middlewares/validation.middleware';
import CreateUserDto from '../users/user.dto';
import LoginDto from './login.dto';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExists.exception';
import * as bcrypt from 'bcrypt';
import WrongCredentialsException from '../exceptions/WrongCredentials.exception';
import User from '../users/user.interface';
import TokenData from '../interfaces/tokenData.interface';
import * as jwt from 'jsonwebtoken';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LoginDto), this.login);
    this.router.get(`${this.path}/logout`, this.logout);
  }

  private registration = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;

    const isEmailAvailable = await this.user.findOne({ email: userData.email });
    if (isEmailAvailable) {
      return next(new UserWithThatEmailAlreadyExistsException(userData.email));
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await this.user.create({
      ...userData,
      password: hashedPassword,
    });

    const token = this.generateToken(newUser);
    res.setHeader('Set-Cookie', [this.createCookie(token)]);

    res.json({ user: newUser });
  }

  private login = async (req: Request, res: Response, next: NextFunction) => {
    const userData: LoginDto = req.body;

    const user = await this.user.findOne({ email: userData.email });
    if (!user) {
      return next(new WrongCredentialsException());
    }

    const isPasswordCorrect = await bcrypt.compare(userData.password, user.password);
    if (!isPasswordCorrect) {
      return next(new WrongCredentialsException());
    }

    const token = this.generateToken(user);
    res.setHeader('Set-Cookie', [this.createCookie(token)]);

    res.json({ user });
  }

  private logout = (req: Request, res: Response) => {
    res.setHeader('Set-Cookie', ['Authorization=;Max-Age=0;'])
    res.json({ message: 'Successfully logout' });
  }

  private generateToken(userData: User): TokenData {
    const expiresIn = 60 * 60;
    const payload: DataStoredInToken = { _id: userData._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    return {
      token,
      expiresIn,
    };
  }

  private createCookie({ token, expiresIn }: TokenData): string {
    return `Authorization=${token}; HttpOnly; Max-Age=${expiresIn}`;
  }
}

export default AuthenticationController;