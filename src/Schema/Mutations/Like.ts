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
  type: types.PayloadType('CREATE_LIKE', {
    like: { type: types.LikeType },
  }),
  args: {
    userId: { type: GraphQLID },
    postId: { type: GraphQLID },
    reactionType: { type: GraphQLString },
  },
  async resolve(parent: any, args: any) {
    const post = await Post.findById(args.postId);
    if (post) {
      const existingLike = await Like.findOne({
        user: args.userId,
        post: args.postId,
      }).populate('user');
      if (existingLike) {
        if (existingLike.reactionType === args.reactionType) {
          return {
            message: 'nothing changed',
            like: existingLike,
          };
        } else {
          await Like.updateOne(
            { _id: existingLike.id },
            {
              reactionType: args.reactionType,
            }
          );
          // console.log(existingLike.reactionType);
          // console.log(args.reactionType);
          const newLike = await Like.findById(existingLike.id).populate('user');
          // console.log(newLike.reactionType);
          return {
            message: 'reactionType changed',
            like: newLike,
          };
        }
      } else {
        const like = new Like({
          user: args.userId,
          post: args.postId,
          reactionType: args.reactionType,
        });
        await like.save();
        post.likes.push(like);
        await post.save();
        return {
          message: 'like created',
          like: Like.findById(like.id).populate('user'),
        };
      }
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
