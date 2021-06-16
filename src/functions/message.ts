import Room from '../models/Room';
import Message from '../models/Message';

export const createMessage = async (
  roomId: string,
  senderId: string,
  body: string
) => {
  const room = await Room.findById(roomId);
  if (room) {
    if (senderId && room.users.includes(senderId)) {
      const message = new Message({
        sender: senderId,
        receivers: room.users.filter((id: any) => id !== senderId),
        room: roomId,
        body,
      });
      await message.save();
      room.messages.push(message);
      await room.save();
    }
  }
};
