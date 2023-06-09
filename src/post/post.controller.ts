import { Router, Request, Response, NextFunction } from 'express';
import Post from './post.entity';
import Controller from '../interfaces/controller.interface';
import PostNotFoundException from '../exceptions/PostNotFound.exception';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';
import authMiddleware from '../middleware/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import PgDataSource from '../pg-data-source';

class PostController implements Controller {
  public path = '/posts';
  public router = Router();
  private postRepo = PgDataSource.getRepository(Post);

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes = () => {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createAPost);
    this.router.patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.deletePost);
  }

  private getAllPosts = async (req: Request, res: Response) => {
    const posts = await this.postRepo.find({
      relations: ['categories'],
    });
    res.json({ posts });
  }

  private getPostById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const post = await this.postRepo.findOne({
      where: {
        id: Number(id),
      },
      relations: ['categories'],
    });
    if (!post) {
      return next(new PostNotFoundException(id));
    }
    return res.json({ post });
  }

  private modifyPost = async (req: Request, res: Response, next: NextFunction) => {
    const postData: CreatePostDto = req.body;
    const { id } = req.params;
    await this.postRepo.update(id, postData);
    const modifiedPost = await this.postRepo.findOne({
      where: {
        id: Number(id),
      },
      relations: ['categories'],
    });
    if (!modifiedPost) {
      return next(new PostNotFoundException(id));
    }
    return res.json({ modifiedPost });
  }

  private createAPost = async (req: RequestWithUser, res: Response) => {
    const postData: CreatePostDto = req.body;
    const newPost = this.postRepo.create({
      ...postData,
      author: req.user,
    });
    await this.postRepo.save(newPost);
    res.json({ newPost });
  }

  private deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const deleteRecord = await this.postRepo.delete(Number(id));
    if (deleteRecord.affected < 1) {
      return next(new PostNotFoundException(id));
    }
    res.json({ message: `Post with id ${id} was deleted` });
  }
}

export default PostController;