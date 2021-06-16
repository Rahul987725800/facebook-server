import {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import types from '../types';
import Like from '../../models/Like';
import Post from '../../models/Post';
export const CREATE_LIKE = {
  type: types.InfoType,
  args: {
    userId: { type: GraphQLID },
    postId: { type: GraphQLID },
  },
  async resolve(parent: any, args: any) {
    const post = await Post.findById(args.postId);
    if (post) {
      const like = new Like({
        user: args.userId,
        post: args.postId,
      });
      await like.save();
      post.likes.push(like);
      await post.save();
      return {
        message: 'like created',
      };
    } else {
      return {
        message: `wrong postId: ${args.postId}`,
      };
    }
  },
};
export const DELETE_LIKE = {
  type: types.InfoType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent: any, args: any) {
    const like = await Like.findById(args.id);
    if (like) {
      await like.delete();
      return {
        message: `like deleted`,
      };
    } else {
      return {
        message: `no like exists with id ${args.id}`,
      };
    }
  },
};
