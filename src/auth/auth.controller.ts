import { Controller } from '../interfaces/controller.interface';
import { Router, Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../users/user.entity';
import { HttpException } from '../exceptions/http.exception';
import { validationMiddleware } from '../middleware/validation.middleware';
import { LoginDto, RegisterDto, TwoFactorTokenDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  twoFactorAuthMiddleware
} from '../middleware/twoFactorAuth.middleware';


export class AuthController implements Controller {
  public path = '/auth';
  public router = Router();
  private authService: AuthService;
  private userRepo: Repository<User>;

  constructor() {
    this.authService = new AuthService();
    this.userRepo = AppDataSource.getRepository(User);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(`${this.path}/login`, validationMiddleware(LoginDto), this.login);
    this.router.post(`${this.path}/register`, validationMiddleware(RegisterDto), this.register);
    this.router.get(`${this.path}/2fa/generate`, authMiddleware, this.generate2FACode);
    this.router.post(`${this.path}/2fa/turn-on`, authMiddleware, validationMiddleware(TwoFactorTokenDto), this.turnOn2FA);
    this.router.post(`${this.path}/2fa/login`, authMiddleware, validationMiddleware(TwoFactorTokenDto), twoFactorAuthMiddleware, this.login2FA);
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
      const { newUser, token, cookie } = await this.authService.register(req.body);
      res.setHeader('Set-Cookie', [cookie]);
      res.json({ newUser, token });
    } catch (e) {
      console.log(e);
      next(new HttpException(e?.status, e?.message));
    }
  }

  private generate2FACode = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user;
      const { otpAuthUrl, base32 } = this.authService.generate2FACode();
      await this.userRepo.update({ id }, { twoFactorAuthCode: base32 });
      this.authService.respondWithQRCode(otpAuthUrl, res);
    } catch (e) {
      next(new HttpException());
    }
  }

  private turnOn2FA  = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { id, twoFactorAuthCode } = req.user;
      const { token } = req.body;
      const is2FATokenValid = this.authService.verify2FAToken(token, twoFactorAuthCode);
      if (!is2FATokenValid) {
        return next(new HttpException(403, 'Wrong Token'));
      }
      await this.userRepo.update({ id }, { isTwoFactorAuthEnabled: true });
      res.json({ message: '2FA Enabled' });
    } catch (e) {
      next(new HttpException());
    }
  }

  private login2FA = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const jwtToken = this.authService.generateToken({ id: user.id }, true);
      res.setHeader('Set-Cookie', [this.authService.createCookie({
        token: jwtToken,
        expiresIn: 60 * 60,
      })]);
      res.json({ user });
    } catch (e) {
      next(new HttpException());
    }
  }
}