import * as mongoose from 'mongoose';
import Post from './post.interface';
import { Schema } from 'mongoose';


const postSchema = new mongoose.Schema({
  author: {
    ref: 'User',
    type: Schema.Types.ObjectId,
  },
  title: String,
  content: String,
});

const postModel = mongoose.model<Post & mongoose.Document>('Post', postSchema);

export default postModel;