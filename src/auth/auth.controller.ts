import { Controller } from '../interfaces/controller.interface';
import { Router, Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../users/user.entity';
import { HttpException } from '../exceptions/http.exception';
import { validationMiddleware } from '../middleware/validation.middleware';
import { LoginDto, RegisterDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';


export class AuthController implements Controller {
  public path = '/auth';
  public router = Router();
  private usersRepo = AppDataSource.getRepository(User);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(`${this.path}/login`, validationMiddleware(LoginDto), this.login);
    this.router.post(`${this.path}/register`, validationMiddleware(RegisterDto), this.register);
  }

  private login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const foundUser = await this.usersRepo.findOne({ where: { email } });
      if (!foundUser) {
        return next(new HttpException(403, 'Wrong Credentials'));
      }

      const isPasswordValid = bcrypt.compare(password, foundUser.password);
      if (!isPasswordValid) {
        return next(new HttpException(403, 'Wrong Credentials'));
      }

      const token = this.generateToken({ id: foundUser.id });

      res.json({ token });
    } catch (e) {
      next(new HttpException());
    }
  }

  private register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, ...rest } = req.body;

      const foundUser = await this.usersRepo.findOne({ where: { email } });
      if (foundUser) {
        return next(new HttpException(400, 'Email already in use'));
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = this.usersRepo.create({ name, email, password: hashedPassword, ...rest });
      await this.usersRepo.save(newUser);

      // @ts-ignore
      const token = this.generateToken({ id: newUser.id });

      res.json({ newUser, token });
    } catch (e) {
      next(new HttpException());
    }
  }

  private generateToken(payload: any): string {
    const expiresIn = 60 * 60;
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  }
}