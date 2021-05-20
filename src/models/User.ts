import { model, Schema } from 'mongoose';
const userSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },

  {
    timestamps: true,
  }
);
const User = model('User', userSchema);
export default User;
