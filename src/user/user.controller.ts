import Controller from '../interfaces/controller.interface';
import { NextFunction, Request, Response, Router } from 'express';
import UserService from './user.service';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';


class UserController implements Controller {
  public path = '/users';
  public router = Router();
  private userServices: UserService;

  constructor() {
    this.userServices = new UserService();

    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostsForUser);
  }

  private getAllPostsForUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const allUsersPosts = await this.userServices.getAllPostsForUser(
        req.params.id,
        req,
      );

      res.json({ allUsersPosts });
    } catch (e) {
      next(e);
    }
  }
}

export default UserController;