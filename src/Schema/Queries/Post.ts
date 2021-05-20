import { GraphQLID, GraphQLList } from 'graphql';
import { verifyAccessToken } from '../..//helpers/jwtHelper';
import Post from '../../models/Post';
import { MyContext } from '../../MyContext';
import types from '../types';

export const GET_ALL_POSTS = {
  type: types.PayloadType('GET_ALL_POSTS', {
    posts: { type: new GraphQLList(types.PostType) },
  }),

  async resolve(parent: any, args: any, context: MyContext) {
    try {
      // console.log(context.payload);
      const payload = await verifyAccessToken(context);
      // console.log(payload);
      // console.log(context.payload);
      const posts = await Post.find().populate('user');
      // console.log(posts);
      return {
        posts,
      };
    } catch (err) {
      // console.log(err);
      return {
        error: true,
        message: err.message,
      };
    }
  },
};
export const GET_POST = {
  type: types.PostType,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  async resolve(parent: any, args: any, context: MyContext) {
    await verifyAccessToken(context);
    const post = await Post.findById(args.id)
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
      });
    // .populate('likes');
    return post;
  },
};
// focus on how you spend your time
// it is very important bro
