import { model, Schema } from 'mongoose';
const postSchema = new Schema(
  {
    body: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Like',
      },
    ],
  },

  {
    timestamps: true,
  }
);
const Post = model('Post', postSchema);
export default Post;
