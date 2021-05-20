import { model, Schema } from 'mongoose';
const commentSchema = new Schema(
  {
    body: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  },
  {
    timestamps: true,
  }
);
const Comment = model('Comment', commentSchema);
export default Comment;
