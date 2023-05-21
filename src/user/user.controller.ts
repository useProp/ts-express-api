import Controller from '../interfaces/controller.interface';
import { Router, Response, NextFunction } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import NotAuthorizedException from '../exceptions/NotAuthorized.exception';
import postModel from '../posts/posts.model';


class UserController implements Controller {
  public path = '/user';
  public router = Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostsForUser);
  }

  private getAllPostsForUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (id !== req.user._id.toString()) {
      return next(new NotAuthorizedException());
    }

    const posts = await this.post.find({ author: id });
    res.json({ posts });
  }
}

export default UserController;