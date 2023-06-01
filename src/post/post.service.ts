import postModel from './post.model';
import PostNotFoundException from '../exceptions/PostNotFound.exception';
import CreatePostDto from './post.dto';

class PostService {
  private post = postModel;

  public createPost = async (postData: CreatePostDto) => {
    console.log(postData);
    const newPost = await this.post.create({
      ...postData,
      author: postData.authorId,
    });
    return newPost.save();
  }

  public getAllPosts = async (options: { [key: string]: any } = {}) => {
    return this.post.find(options)
  }

  public getOne = async (_id: string) => {
    const post = await this.post.findOne({ _id });
    if (!post) {
      throw new PostNotFoundException(_id);
    }
  }

  public modifyPost = async (_id: string, postData: CreatePostDto) => {
    const modifiedPost = await this.post.findOneAndUpdate({ _id }, postData, { new: true });
    if (!modifiedPost) {
      throw new PostNotFoundException(_id);
    }
  }

  public deletePost = async (_id: string) => {
    const deletedItem = await this.post.findOneAndDelete({ _id });
    if (!deletedItem) {
      throw new PostNotFoundException(_id);
    }
    return deletedItem;
  }
}

export default PostService;