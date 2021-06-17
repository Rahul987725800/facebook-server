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
        receiver: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        seen: Boolean,
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
