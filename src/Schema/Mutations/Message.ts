import {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import Message from '../../models/Message';
import Room from '../../models/Room';
import types from '../types';
export const CREATE_MESSAGE = {
  type: types.InfoType,
  args: {
    senderId: { type: GraphQLID },
    roomId: { type: GraphQLID },
    body: { type: GraphQLString },
  },
  async resolve(parent: any, args: any) {
    const room = await Room.findById(args.roomId);
    if (room) {
      if (args.senderId && room.users.includes(args.senderId)) {
        const message = new Message({
          sender: args.senderId,
          receivers: room.users.filter((id: any) => id !== args.senderId),
          room: args.roomId,
          body: args.body,
        });
        await message.save();
        room.messages.push(message);
        await room.save();
        return {
          message: 'message created',
        };
      } else {
        return {
          error: true,
          message: "sender doesn't belongs to room",
        };
      }
    } else {
      return {
        error: true,
        message: `wrong roomId: ${args.roomId}`,
      };
    }
  },
};
