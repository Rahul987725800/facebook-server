import {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import bcrypt from 'bcrypt';
import types from '../types';
import User from '../../models/User';
import { authSchema } from '../../helpers/validationSchema';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../helpers/jwtHelper';
import { MyContext } from '../../MyContext';
import redisClient from '../../helpers/initRedis';
export const CREATE_USER = {
  type: types.PayloadType('CREATE_USER', {
    accessToken: { type: GraphQLString },
    refreshToken: { type: GraphQLString },
  }),
  args: {
    email: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent: any, args: any, context: MyContext) {
    try {
      const result = await authSchema({}).validateAsync(args);
      const existingUserWithEmail = await User.findOne({ email: result.email });
      if (existingUserWithEmail) {
        throw new Error(`${result.email} is already registered`);
      }
      const hashedPassword = await bcrypt.hash(result.password, 12);
      const user = new User({
        email: result.email,
        password: hashedPassword,
        username: result.username,
      });
      await user.save();
      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);

      return {
        message: `user created with id ${user.id}`,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      if (err.isJoi) {
        // console.log(err.details[0].message);
        return {
          error: true,
          message: err.details[0].message,
        };
      }
      // console.log(err);
      return {
        error: true,
        message: err.message,
      };
    }
  },
};
export const LOGIN_USER = {
  type: types.PayloadType('LOGIN_USER', {
    accessToken: { type: GraphQLString },
    refreshToken: { type: GraphQLString },
  }),
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent: any, args: any, context: MyContext) {
    try {
      const result = await authSchema({ username: false }).validateAsync(args);
      const user = await User.findOne({ email: result.email });
      if (!user) {
        throw new Error(`Email not registered`);
      }
      const valid = await bcrypt.compare(result.password, user.password);
      if (!valid) {
        throw new Error('wrong password');
      }
      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);

      return {
        message: `logged in successfully userId: ${user.id}`,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      if (err.isJoi) {
        // console.log(err.details[0].message);
        return {
          error: true,
          message: err.details[0].message,
        };
      }
      // console.log(err);
      return {
        error: true,
        message: err.message,
      };
    }
  },
};
export const LOGOUT_USER = {
  type: types.MessageType,
  args: {
    refreshToken: { type: GraphQLString },
  },
  async resolve(parent: any, args: any, context: any) {
    try {
      if (!args.refreshToken) {
        throw new Error('no refresh token');
      }
      const userId = await verifyRefreshToken(args.refreshToken);
      redisClient.DEL(userId as string, (err, val) => {
        if (err) {
          console.log(err.message);
          throw new Error(
            'Redis error while deleting refreshToken from redis db'
          );
        }
        console.log(val);
      });
      return {
        message: 'logged out successfully',
      };
    } catch (err) {
      return {
        error: true,
        message: err.message,
      };
    }
  },
};
export const UPDATE_USER_PASSWORD = {
  type: types.MessageType,
  args: {
    id: { type: GraphQLString },
    email: { type: GraphQLString },
    oldPassword: { type: GraphQLString },
    newPassword: { type: GraphQLString },
  },
  async resolve(parent: any, args: any) {
    try {
      let user;
      if (args.email) {
        user = await User.findOne({
          email: args.email,
        });
      } else {
        user = await User.findById(args.id);
      }
      // console.log(user);
      if (user) {
        const valid = await bcrypt.compare(args.oldPassword, user.password);
        if (!valid) {
          throw new Error('wrong password');
        }
        const result = await authSchema({
          email: false,
          username: false,
        }).validateAsync({
          password: args.newPassword,
        });
        const hashedPassword = await bcrypt.hash(result.password, 12);
        user.password = hashedPassword;
        await user.save();
        return {
          message: 'password updated successfully',
        };
      } else {
        throw new Error(
          `no user exists with ${
            args.email ? `email: ${args.email}` : `id: ${args.id}`
          }`
        );
      }
    } catch (err) {
      if (err.isJoi) {
        // console.log(err.details[0].message);
        return {
          error: true,
          message: err.details[0].message,
        };
      }
      // console.log(err);
      return {
        error: true,
        message: err.message,
      };
    }
  },
};
export const DELETE_USER = {
  type: types.MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent: any, args: any) {
    const user = await User.findByIdAndDelete(args.id);
    // console.log(user);
    // Users.delete(args.id);
    if (user) {
      return {
        message: 'deleted successfully',
      };
    } else {
      return {
        message: `no user exists with id ${args.id}`,
      };
    }
  },
};
export const REFRESH_TOKEN = {
  type: types.PayloadType('REFRESH_TOKEN', {
    accessToken: { type: GraphQLString },
    refreshToken: { type: GraphQLString },
  }),
  args: {
    refreshToken: { type: GraphQLString },
  },
  async resolve(parent: any, args: any, context: any) {
    try {
      if (!args.refreshToken) {
        throw new Error('no refresh token');
      }
      const userId = (await verifyRefreshToken(args.refreshToken)) as string;
      const accessToken = await signAccessToken(userId);
      const newRefreshToken = await signRefreshToken(userId);
      return {
        accessToken,
        refreshToken: newRefreshToken,
        message: 'refreshed token successfully',
      };
    } catch (err) {
      return {
        error: true,
        message: err.message,
      };
    }
  },
};
