import {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import types from '../types';
import Comment from '../../models/Comment';
import Post from '../../models/Post';
export const CREATE_COMMENT = {
  type: types.InfoType,
  args: {
    body: { type: GraphQLString },
    userId: { type: GraphQLID },
    postId: { type: GraphQLID },
  },
  async resolve(parent: any, args: any) {
    const post = await Post.findById(args.postId);
    if (post) {
      const comment = new Comment({
        body: args.body,
        user: args.userId,
        post: args.postId,
      });
      await comment.save();
      post.comments.push(comment);
      await post.save();
      return {
        message: 'comment created',
      };
    } else {
      return {
        message: `wrong postId: ${args.postId}`,
      };
    }
  },
};
export const UPDATE_COMMENT = {
  type: types.InfoType,
  args: {
    id: { type: GraphQLID },
    body: { type: GraphQLString },
  },
  async resolve(parent: any, args: any) {
    const comment = await Comment.findById(args.id);
    if (comment) {
      comment.body = args.body;
      await comment.save();
      return {
        message: `comment updated`,
      };
    } else {
      return {
        message: `no comment exists with id ${args.id}`,
      };
    }
  },
};
export const DELETE_COMMENT = {
  type: types.InfoType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent: any, args: any) {
    const comment = await Comment.findById(args.id);
    if (comment) {
      await comment.delete();
      return {
        message: `comment deleted`,
      };
    } else {
      return {
        message: `no comment exists with id ${args.id}`,
      };
    }
  },
};
