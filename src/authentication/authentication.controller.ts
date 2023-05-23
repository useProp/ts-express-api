import Controller from '../interfaces/controller.interface';
import { NextFunction, Request, Response, Router } from 'express';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../user/user.dto';
import AuthenticationService from './authentication.service';
import LoginDto from './login.dto';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  private authService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LoginDto), this.login);
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
}

export default AuthenticationController;