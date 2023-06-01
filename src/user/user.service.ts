import PostService from '../post/post.service';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import NotAuthorizedException from '../exceptions/NotAuthorized.exception';
import userModel from './user.model';
import CreateUserDto from './user.dto';


class UserService {
  private postService: PostService;
  private user;

  constructor() {
    this.user = userModel;
    this.postService = new PostService();
  }

  public create = async (userData: CreateUserDto) => {
    const newUser = await this.user.create(userData);
    return newUser.save();
  }

  public getOne = async (options) => {
    return await this.user.findOne(options);
  }

  public getAllPostsForUser = async (id: string, req: RequestWithUser) => {
    if (!req.user || req.user._id.toString() !== id) {
      throw new NotAuthorizedException();
    }
    return this.postService.getAllPosts({ author: req.user._id });
  }

  public getOneAndUpdate = async (_id: string, options: { [key: string]: any } = {}) => {
    const updatedUser = await this.user.findOneAndUpdate({ _id }, options, { new: true });
    if (!updatedUser) {
      throw new NotAuthorizedException();
    }
    return updatedUser;
  }

}

export default UserService;