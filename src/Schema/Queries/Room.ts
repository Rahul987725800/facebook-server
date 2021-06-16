import { GraphQLID, GraphQLList } from 'graphql';
import Room from '../../models/Room';
import types from '../types';

export const GET_ALL_ROOMS = {
  type: new GraphQLList(types.RoomType),

  async resolve(parent: any, args: any) {
    const rooms = await Room.find().populate('users').populate('messages');
    // console.log(posts);
    return rooms;
  },
};
export const GET_ROOM = {
  type: types.RoomType,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  async resolve(parent: any, args: any) {
    const room = await Room.findById(args.id)
      .populate('users')
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
        },
      });
    return room;
  },
};
