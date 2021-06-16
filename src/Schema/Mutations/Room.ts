import {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import Room from '../../models/Room';
import types from '../types';
export const CREATE_ROOM = {
  type: types.RoomType,
  args: {
    userIds: { type: new GraphQLList(GraphQLID) },
  },
  async resolve(parent: any, args: any) {
    const userIds = args.userIds;
    // console.log(userIds);
    userIds.sort();
    // console.log(userIds);
    const identifier = userIds.join('');
    // console.log(identifier);
    const existingRoom = await Room.findOne({ identifier })
      .populate('users')
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
        },
      });
    if (existingRoom) {
      return existingRoom;
    } else {
      const room = new Room({
        users: userIds,
        messages: [],
        identifier,
      });
      await room.save();
      return Room.findById(room.id)
        .populate('users')
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
          },
        });
    }
  },
};
