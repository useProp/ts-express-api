import { Router, Request, Response, NextFunction } from 'express';
import Post from './post.interface';
import Controller from '../interfaces/controller.interface';
import postModel from './posts.model';
import PostNotFoundException from '../exceptions/PostNotFound.exception';
import validationMiddleware from '../middlewares/validation.middleware';
import CreatePostDto from './post.dto';

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
    this.router.post(this.path, validationMiddleware(CreatePostDto), this.createAPost);
    this.router.patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost);
    this.router.delete(`${this.path}/:id`, this.deletePost);
  }

  private getAllPosts = (req: Request, res: Response) => {
    this.post
      .find()
      .then(posts => res.json(posts));
  }

  private getPostById = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    this.post
      .findById(id)
      .then(post => {
        if (post) {
          return res.json(post);
        }

        next(new PostNotFoundException(id));
      });
  }

  private modifyPost = (req: Request, res: Response, next: NextFunction) => {
    const postData = req.body;
    const { id } = req.params;
    this.post
      .findByIdAndUpdate(id, postData, { new: true })
      .then(post => {
        if (post) {
          return res.json(post);
        }

        next(new PostNotFoundException(id));
      });
  }

  private createAPost = (req: Request, res: Response) => {
    const postData: Post = req.body;
    const createdPost = new this.post(postData);
    createdPost
      .save()
      .then(post => res.json(post));
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