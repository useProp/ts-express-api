import { Router, Request, Response, NextFunction } from 'express';
import Post from './post.interface';
import Controller from '../interfaces/controller.interface';
import postModel from './posts.model';
import PostNotFoundException from '../exceptions/PostNotFound.exception';
import validationMiddleware from '../middlewares/validation.middleware';
import CreatePostDto from './post.dto';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';

class PostsController implements Controller {
  public path = '/posts';
  public router = Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes = () => {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createAPost);
    this.router.patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost);
    this.router.delete(`${this.path}/:id`, this.deletePost);
  }

  private getAllPosts = async (req: Request, res: Response) => {
    const posts = await this.post
      .find()
      .populate('author', 'name');
    res.json({ posts });
  }

  private getPostById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const post = await this.post
      .findById(id)
      .populate('author', 'name');
    if (!post) {
      return next(new PostNotFoundException(id));
    }
    return res.json({ post });
  }

  private modifyPost = async (req: Request, res: Response, next: NextFunction) => {
    const postData = req.body;
    const { id } = req.params;
    const post = await this.post
      .findByIdAndUpdate(id, postData, { new: true })
      .populate('author', 'name');
    if (!post) {
      return next(new PostNotFoundException(id));
    }
    return res.json({ post });
  }

  private createAPost = async (req: RequestWithUser, res: Response) => {
    const postData: Post = req.body;
    const post = await this.post.create({
      ...postData,
      author: req.user._id,
    });

    await post.populate('author', 'name');

    res.json({ post });
  }

  private deletePost = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    this.post
      .findByIdAndDelete(id)
      .then(success => {
        if (success) {
          return res.json(success);
        }

        next(new PostNotFoundException(id));
      });
  }
}

export default PostsController;