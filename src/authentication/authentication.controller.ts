import Controller from '../interfaces/controller.interface';
import { NextFunction, Request, Response, Router } from 'express';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../user/user.dto';
import LoginDto from './login.dto';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExists.exception';
import * as bcrypt from 'bcrypt';
import WrongCredentialsException from '../exceptions/WrongCredentials.exception';
import TokenData from '../interfaces/tokenData.interface';
import * as jwt from 'jsonwebtoken';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import PgDataSource from '../pg-data-source';
import userEntity from '../user/user.entity';
import User from '../user/user.entity';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  private userRepo = PgDataSource.getRepository(userEntity);

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

    const isEmailAvailable = await this.userRepo.findOneBy({ email: userData.email });
    if (isEmailAvailable) {
      return next(new UserWithThatEmailAlreadyExistsException(userData.email));
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = this.userRepo.create({
      ...userData,
      password: hashedPassword,
    });
    await this.userRepo.save(newUser);

    const token = this.generateToken(newUser);
    res.setHeader('Set-Cookie', [this.createCookie(token)]);

    res.json({ user: newUser });
  }

  private login = async (req: Request, res: Response, next: NextFunction) => {
    const userData: LoginDto = req.body;

    const user = await this.userRepo.findOneBy({ email: userData.email });
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
    const payload: DataStoredInToken = { id: userData.id };
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