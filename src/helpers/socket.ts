let io: any;
const socketHelper = {
  init: (httpServer: any) => {
    const initSocket = require('socket.io');
    // console.log(initSocket);
    io = initSocket(httpServer, {
      cors: {
        origin: '*',
      },
    });
    // console.log(io);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
};
export default socketHelper;
