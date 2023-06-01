import Controller from '../interfaces/controller.interface';
import { NextFunction, Request, Response, Router } from 'express';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../user/user.dto';
import AuthenticationService from './authentication.service';
import LoginDto from './login.dto';
import UserService from '../user/user.service';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import TwoFactorAuthenticationDto from './twoFactorAuthentication.dto';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  private authService: AuthenticationService;
  private userService: UserService;

  constructor() {
    this.initializeRoutes();
    this.authService = new AuthenticationService();
    this.userService = new UserService();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LoginDto), this.login);
    this.router.post(
      `${this.path}/2fa/enable`,
      authMiddleware(false),
      validationMiddleware(TwoFactorAuthenticationDto),
      this.turnOnTwoFactorAuthentication
    );
    this.router.post(
      `${this.path}/2fa/authenticate`,
      validationMiddleware(TwoFactorAuthenticationDto),
      authMiddleware(false),
      this.secondFactorAuthentication,
    );
    this.router.get(`${this.path}/2fa/generate`, authMiddleware(false), this.generateTwoFactorAuthenticationCode);
  }

  private registration = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cookie, user } = await this.authService.registration(req.body);
      res.setHeader('Set-Cookie', [cookie]);
      res.json({ user });
    } catch (e) {
      next(e);
    }
  }

  private login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cookie, user } = await this.authService.login(req.body);
      res.setHeader('Set-Cookie', [cookie]);

      res.json({ user });
    } catch (e) {
      next(e);
    }
  }

  private generateTwoFactorAuthenticationCode = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { otpauth_url, base32 } = this.authService.getTwoFactorAuthenticationCode();
      await this.userService.getOneAndUpdate(req.user._id.toString(), {
        twoFactorAuthenticationCode: base32,
      });
      return this.authService.respondWithQRCode(res, otpauth_url);
    } catch (e) {
      next(e);
    }
  }

  private turnOnTwoFactorAuthentication = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { twoFactorAuthenticationCode } = req.body;
      await this.authService.verifyTwoFactorAuthenticationCode(twoFactorAuthenticationCode, req.user);
      await this.userService.getOneAndUpdate(req.user._id, {
        isTwoFactorAuthenticationEnabled: true,
      });
      res.json({ message: 'OK' });
    } catch (e) {
      next(e);
    }
  }

  private secondFactorAuthentication = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { twoFactorAuthenticationCode } = req.body;
      const { user } = req;
      await this.authService.verifyTwoFactorAuthenticationCode(twoFactorAuthenticationCode, user);
      const tokenData = this.authService.createToken(user, true);
      res.setHeader('Set-Cookie', [this.authService.createCookie(tokenData)]);

      res.json({
        // @ts-ignore
        ...user.toObject(),
        password: null,
        twoFactorAuthenticationCode: null,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default AuthenticationController;