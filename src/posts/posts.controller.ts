import { Router, Request, Response } from 'express';
import Post from './post.interface';


class PostsController {
  public path: string = '/posts';
  public router: Router = Router();

  private posts: Post[] = [
    {
      author: 'Author One',
      title: 'Title One',
      content: 'Content One',
    }
  ]

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(this.path, this.getAllPosts);
    this.router.post(this.path, this.createPost);
  }

  getAllPosts = (req: Request, res: Response): void => {
    res.json({
      posts: this.posts,
    });
  }

  createPost = (req: Request, res: Response): void => {
    const post: Post = req.body;
    this.posts.push(post);
    res.json({
      post,
    });
  }
}

export default PostsController;