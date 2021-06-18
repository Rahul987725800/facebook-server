import {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import types from '../types';
import Post from '../../models/Post';
import User from '../../models/User';

export const CREATE_POST = {
  type: types.PayloadType('CREATE_POST', {
    post: { type: types.PostType },
  }),
  args: {
    body: { type: GraphQLString },
    userId: { type: GraphQLID },
    imageUrl: { type: GraphQLString },
  },
  async resolve(parent: any, args: any) {
    const user = await User.findById(args.userId);
    if (user) {
      const newPost = new Post({
        body: args.body,
        user: user.id,
        imageUrl: args.imageUrl,
      });
      const savedPost = await newPost.save();
      user.posts.push(savedPost);
      await user.save();
      return {
        message: `post created with id ${savedPost.id}`,
        post: Post.findById(savedPost.id)
          .populate('user')
          .populate({
            path: 'comments',
            populate: {
              path: 'user',
            },
          })
          .populate({
            path: 'likes',
            populate: {
              path: 'user',
            },
          }),
      };
    }
    return {
      message: `wrong userId: ${args.userId}`,
    };
  },
};
export const UPDATE_POST = {
  type: types.InfoType,
  args: {
    id: { type: GraphQLID },
    body: { type: GraphQLString },
  },
  async resolve(parent: any, args: any) {
    const post = await Post.findById(args.id);
    if (post) {
      post.body = args.body;
      await post.save();
      return {
        message: `post updated`,
      };
    } else {
      return {
        message: `no post exists with id ${args.id}`,
      };
    }
  },
};
export const DELETE_POST = {
  type: types.InfoType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent: any, args: any) {
    const post = await Post.findById(args.id);
    if (post) {
      await post.delete();
      return {
        message: `post deleted`,
      };
    } else {
      return {
        message: `no post exists with id ${args.id}`,
      };
    }
  },
};
