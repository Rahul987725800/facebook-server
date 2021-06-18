import { model, Schema } from 'mongoose';
const likeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    reactionType: String,
  },
  {
    timestamps: true,
  }
);
const Like = model('Like', likeSchema);
export default Like;
