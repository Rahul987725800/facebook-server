import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import { schema } from './Schema';
import socketHelper from './helpers/socket';
import { createMessage } from './functions/message';
const app = express();
app.get('/', (_req, res) => {
  res.send('<h1>Connected visit please visit please /graphql</h1>');
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
      socket.on('join-room', (roomId: string, cb: any) => {
        socket.join(roomId);
        cb('Joined ' + roomId);
      });
    });
  })
  .then(() => {
    console.log(`Server running at PORT: ${PORT}`);
  });
