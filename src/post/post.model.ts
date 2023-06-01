import { Schema, model, Document } from 'mongoose';
import Post from './post.interface';

const postSchema = new Schema({
  author: {
    ref: 'User',
    type: Schema.Types.ObjectId,
  },
  title: String,
  content: String,
});

const postModel = model<Post & Document>('Post', postSchema);

export default postModel;