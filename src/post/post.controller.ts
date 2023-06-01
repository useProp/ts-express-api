import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';
import authMiddleware from '../middleware/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import PostService from './post.service';

class PostController implements Controller {
  public path = '/posts';
  public router = Router();
  private postService: PostService;
  constructor() {
    this.initializeRoutes();
    this.postService = new PostService();
  }

  public initializeRoutes = () => {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createAPost);
    this.router.patch(`${this.path}/:id`, authMiddleware, validationMiddleware(CreatePostDto, true), this.modifyPost);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.deletePost);
  }

  private getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await this.postService.getAllPosts();
      res.json({ posts });
    } catch (e) {
      next(e);
    }
  }

  private getPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await this.postService.getOne(req.params.id);
      return res.json({ post });
    } catch (e) {
      next(e);
    }
  }

  private modifyPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const modifiedPost = await this.postService.modifyPost(
        req.params.id,
        req.body,
      );
      return res.json({ modifiedPost });
    } catch (e) {
      next(e);
    }
  }

  private createAPost = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const newPost = await this.postService.createPost(req.body);
      res.json({ newPost });
    } catch (e) {
      next(e);
    }
  }

  private deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deletedItem = this.postService.deletePost(req.params.id);
      res.json({ deletedItem });
    } catch (e) {
      next(e);
    }

  }
}

export default PostController;