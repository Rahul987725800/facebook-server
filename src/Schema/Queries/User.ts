import { GraphQLID, GraphQLList, GraphQLString } from 'graphql';
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
    return User.findById(context.payload.aud);
  },
};
