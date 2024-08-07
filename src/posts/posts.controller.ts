import { Router, Request, Response } from 'express';
import Post from './post.interface';
import postModel from './posts.model';
import { Controller } from '../interfaces/controller.interface';


class PostsController implements Controller {
  public path: string = '/posts';
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(this.path, this.getAllPosts);
    this.router.post(this.path, this.createPost);
    this.router.get(`${this.path}/:id`, this.getById);
    this.router.patch(`${this.path}/:id`, this.updateOne);
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

  private getById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const post = await postModel.findById(id);
      res.json({
        post,
      });
    } catch (e) {
      console.error('getById', e);
    }
  }

  private updateOne = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const postData: Post = req.body;
      const post = await postModel.findByIdAndUpdate(id, postData, { new: true, });
      res.json({
        post,
      });
    } catch (e) {
      console.error('updateOne', e);
    }
  }

  private deleteOne = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const response = await postModel.findByIdAndDelete(id);
      if (!response) {
        res
          .status(404)
          .json({ message: 'Not Found', });
        return;
      }
      res.json({ message: 'OK' });
    } catch (e) {
      console.log('deleteOne', e);
    }
  }
}

export default PostsController;