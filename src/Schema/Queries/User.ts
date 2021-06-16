import { GraphQLID, GraphQLList, GraphQLString } from 'graphql';
import Post from '../../models/Post';
import { verifyAccessToken } from '../../helpers/jwtHelper';
import User from '../../models/User';

import types from '../types';

export const GET_ALL_USERS = {
  type: new GraphQLList(types.UserType),
  async resolve() {
    const users = await User.find();
    // console.log(users);
    return users;
  },
};
export const GET_USER = {
  type: types.UserType,
  args: {
    id: {
      type: GraphQLID,
    },
    email: {
      type: GraphQLString,
    },
  },
  async resolve(parent: any, args: any) {
    // console.log(args);
    let user;
    if (args.id) {
      user = await User.findById(args.id);
    } else if (args.email) {
      user = await User.findOne({
        email: args.email,
      });
    }

    // console.log(user);
    return user;
  },
};
export const ME = {
  type: types.UserType,
  async resolve(parent: any, args: any, context: any) {
    await verifyAccessToken(context);
    const user = await User.findById(context.payload.aud);
    const postIds: string[] = user.posts;
    const posts = postIds.map((id) =>
      Post.findById(id)
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
        })
    );
    const result: any = {};
    for (let key in user) {
      result[key] = user[key];
    }
    result.posts = posts;
    return result;
  },
};
