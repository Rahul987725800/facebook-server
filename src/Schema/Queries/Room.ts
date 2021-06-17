import { GraphQLID, GraphQLList } from 'graphql';
import Message from '../../models/Message';
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
    const room = await Room.findById(args.id).populate('users');
    if (!room) return null;
    const messageIds = room.messages;
    // console.log(messageIds);

    const messages: any[] = [];
    for (let id of messageIds) {
      const message = await Message.findById(id)
        .populate('sender')
        .populate({
          path: 'receivers',
          populate: {
            path: 'receiver',
          },
        });
      // console.log(message);
      messages.push(message);
    }

    const result: any = {};
    for (let k in room) {
      result[k] = room[k];
    }
    result.messages = messages;
    return result;
  },
};
