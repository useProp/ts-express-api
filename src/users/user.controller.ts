import { Controller } from '../interfaces/controller.interface';
import { NextFunction, Router, Request, Response } from 'express';
import postModel from '../posts/posts.model';
import { ServerException } from '../exceptions/Server.exception';
import { userModel } from './user.model';
import { UserNotFoundException } from '../exceptions/UserNotFound.exception';

export class UserController implements Controller {
  public router = Router();
  public path = '/users';
  private post = postModel;
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}/:id`, this.getUser);
    this.router.get(`${this.path}/:id/posts`, this.getUserPosts);
  }

  private getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const foundUser = await this.user.findById(id);
      if (!foundUser) {
        return next(new UserNotFoundException())
      }

      foundUser.password = undefined;

      res.json({ user: foundUser });
    } catch (e) {
      console.log('getUser', e);
      next(new ServerException());
    }
  }

  private getUserPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const foundUser = await this.user.findById(id);
      if (!foundUser) {
        return next(new UserNotFoundException())
      }

      const userPosts = await this.post.find({ author: id });
      res.json({
        posts: userPosts,
      });
    } catch (e) {
      console.log('getUserPosts', e);
      next(new ServerException());
    }
  }
}