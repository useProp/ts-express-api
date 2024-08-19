import { Router, Request, Response, NextFunction } from 'express';
import { Controller } from '../interfaces/controller.interface';
import { AppDataSource } from '../data-source';
import { Post } from './posts.entity';
import { HttpException } from '../exceptions/http.exception';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreatePostDto, UpdatePostDto } from './post.dto';


class PostController implements Controller {
  public path: string = '/posts';
  public router: Router = Router();
  private postsRepo = AppDataSource.getRepository(Post);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, this.getAll);
    this.router.get(`${this.path}/:id`, this.getOne);
    this.router.post(`${this.path}`, validationMiddleware(CreatePostDto), this.create);
    this.router.patch(`${this.path}/:id`, validationMiddleware(UpdatePostDto), this.update);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  private getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await this.postsRepo.find();
      res.json({ posts });
    } catch (e) {
      new HttpException();
    }
  }

  private getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const post = await this.postsRepo.findOne({ where: { id: Number(id) } });
      if (!post) {
        return next(new HttpException(404, 'Post not found'));
      }
      res.json({ post });
    } catch (e) {
      new HttpException();
    }
  }

  private create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postData = req.body;
      const newPost = this.postsRepo.create(postData);
      await this.postsRepo.save(newPost);
      res.json({ newPost });
    } catch (e) {
      new HttpException();
    }
  }

  private update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const postData = req.body;
      await this.postsRepo.update(id, postData);
      const post = await this.postsRepo.findOne({ where: { id: Number(id) } });
      res.json({ post });
    } catch (e) {
      new HttpException();
    }
  }

  private delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleteResult = await this.postsRepo.delete(id);
      if (deleteResult.affected === 0) {
        return next(new HttpException(404, 'Post not found'));
      }
      res.json({ message: 'OK' });
    } catch (e) {
      new HttpException();
    }
  }
}

export default PostController;