import { Router, Request, Response, NextFunction } from 'express';
import Post from './post.interface';
import postModel from './posts.model';
import { Controller } from '../interfaces/controller.interface';
import { HttpException } from '../exceptions/Http.exception';
import { PostNotFoundException } from '../exceptions/PostNotFound.exception';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreatePostDto } from './createPost.dto';


class PostsController implements Controller {
  public path: string = '/posts';
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(this.path, this.getAllPosts);
    this.router.post(this.path, validationMiddleware(CreatePostDto), this.createPost);
    this.router.get(`${this.path}/:id`, this.getById);
    this.router.patch(`${this.path}/:id`, validationMiddleware(CreatePostDto), this.updateOne);
    this.router.delete(`${this.path}/:id`, this.deleteOne);
  }

  private getAllPosts = async (req: Request, res: Response) => {
    try {
      const posts = await postModel.find();
      res.json({
        posts,
      });
    } catch (e) {
      console.error('getAllPosts', e);
    }

  }

  private createPost = async (req: Request, res: Response) => {
    try {
      const postData: Post = req.body;
      const newPost = new postModel(postData);
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
      const post = await postModel.findById(id);

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
      const post = await postModel.findByIdAndUpdate(id, postData, { new: true, });

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
      const response = await postModel.findByIdAndDelete(id);


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

export default PostsController;