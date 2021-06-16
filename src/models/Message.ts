import { model, Schema } from 'mongoose';
const messageSchema = new Schema(
  {
    body: String,
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    receivers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
    },
  },
  {
    timestamps: true,
  }
);
const Message = model('Message', messageSchema);
export default Message;
