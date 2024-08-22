import { Controller } from '../interfaces/controller.interface';
import { Router, Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../users/user.entity';
import { HttpException } from '../exceptions/http.exception';
import { validationMiddleware } from '../middleware/validation.middleware';
import { LoginDto, RegisterDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';


export class AuthController implements Controller {
  public path = '/auth';
  public router = Router();
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(`${this.path}/login`, validationMiddleware(LoginDto), this.login);
    this.router.post(`${this.path}/register`, validationMiddleware(RegisterDto), this.register);
  }

  private login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await this.authService.login(req.body);
      res.json(token);
    } catch (e: any) {
      next(new HttpException(e?.status, e?.message));
    }
  }

  private register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { newUser, token } = await this.authService.register(req.body);

      res.json({ newUser, token });
    } catch (e) {
      next(new HttpException(e?.status, e?.message));
    }
  }
}