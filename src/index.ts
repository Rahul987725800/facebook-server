import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import { schema } from './Schema';
import socketHelper from './helpers/socket';
import { createMessage } from './functions/message';
import uploadFile from './helpers/uploadFile';
import Asset from './models/Asset';
const app = express();
app.use(cors());
app.get('/', (_req, res) => {
  res.send('<h1>Connected visit please visit please /graphql</h1>');
});
// console.log(__dirname);
app.use('/images', express.static(path.join(__dirname, '../images')));

app.post('/assets', uploadFile, async (req, res) => {
  if (!req.file) {
    console.log('no image');
    return res.json({
      error: true,
      message: 'Image not provided',
    });
  }
  const imageUrl = req.file.path.replace('\\', '/');
  try {
    const createdAsset = await new Asset({
      type: 'image',
      value: imageUrl,
    });
    createdAsset.save();
    return res.status(201).json({
      message: 'Asset created successfully',
      asset: createdAsset,
    });
  } catch (err) {
    return res.json({
      error: true,
      message: err.message,
    });
  }
});
const apolloServer = new ApolloServer({
  schema: schema,
  context: ({ req, res }) => ({
    req,
    res,
  }),
});
apolloServer.applyMiddleware({
  app,
});
const PORT = process.env.PORT || 8000;
mongoose
  .connect(process.env.MONGODB_URI!, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB Connected');
    const server = app.listen(PORT);
    const io = socketHelper.init(server);
    io.on('connection', (socket: any) => {
      // console.log('Client connected with id ' + socket.id);
      socket.on(
        'send-message',
        (message: string, roomId: string, sender: any) => {
          // console.log(message, room);
          if (roomId && sender) {
            socket.broadcast
              .to(roomId)
              .emit('receive-message', message, sender);
            createMessage(roomId, sender.id, message);
          }
        }
      );
      socket.on('join-room', (roomId: string, joinerId: string) => {
        socket.join(roomId);

        if (joinerId) {
          socket.broadcast.to(roomId).emit('member-joined-chat', joinerId);
        }
      });
    });
  })
  .then(() => {
    console.log(`Server running at PORT: ${PORT}`);
  });
