import { Router, Request, Response, NextFunction } from 'express';
import Post from './post.interface';
import postModel from './posts.model';
import { Controller } from '../interfaces/controller.interface';
import { HttpException } from '../exceptions/Http.exception';
import { PostNotFoundException } from '../exceptions/PostNotFound.exception';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreatePostDto, PatchPostDto } from './post.dto';
import { authMiddleware } from '../middleware/auth.middleware';
import { RequestWithUser } from '../interfaces/requestWIthUser.interface';


class PostController implements Controller {
  public path: string = '/posts';
  public router: Router = Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getById);
    this.router.post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost);
    this.router.patch(`${this.path}/:id`, authMiddleware, validationMiddleware(PatchPostDto), this.updateOne);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.deleteOne);
  }

  private getAllPosts = async (req: Request, res: Response) => {
    try {
      const posts = await this.post.find();
      res.json({
        posts,
      });
    } catch (e) {
      console.error('getAllPosts', e);
    }

  }

  private createPost = async (req: RequestWithUser, res: Response) => {
    try {
      const postData: Post = req.body;
      const newPost = new this.post({
        ...postData,
        author: req.user._id,
      });
      const savedPost = await newPost.save();
      res.json({
        post: savedPost,
      });
    } catch (e) {
      console.error('createPost', e);
    }
  }

  private getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const post = await this.post.findById(id);

      if (!post) {
        next(new PostNotFoundException(id));
        return;
      }

      res.json({
        post,
      });
    } catch (e) {
      console.error('getById', e);
      next(new HttpException(e?.message || 'Something went wrong', 500));
    }
  }

  private updateOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const postData: Post = req.body;
      const post = await this.post.findByIdAndUpdate(id, postData, { new: true, });

      if (!post) {
        next(new PostNotFoundException(id));
        return;
      }

      res.json({
        post,
      });
    } catch (e) {
      console.error('updateOne', e);
      next(new HttpException(e?.message || 'Something went wrong', 500));
    }
  }

  private deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const response = await this.post.findByIdAndDelete(id);


      if (!response) {
        next(new PostNotFoundException(id));
        return;
      }

      res.json({ message: 'OK' });
    } catch (e) {
      console.log('deleteOne', e);
      next(new HttpException(e?.message || 'Something went wrong', 500));
    }
  }
}

export default PostController;