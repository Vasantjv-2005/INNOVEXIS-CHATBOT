  const { Server } =
  require("socket.io");

let io;

const initSocket = (
  server
) => {
  io = new Server(server, {
    cors: {
      origin:
        process.env.CLIENT_URL ||
        "*",

      methods: [
        "GET",
        "POST",
      ],
    },
  });

  io.on(
    "connection",
    (socket) => {
      console.log(
        `🟢 User Connected: ${socket.id}`
      );

      socket.on(
        "join-chat",
        (chatId) => {
          socket.join(
            chatId
          );

          console.log(
            `📌 Joined Chat: ${chatId}`
          );
        }
      );

      socket.on(
        "send-message",
        (data) => {
          io.to(
            data.chatId
          ).emit(
            "receive-message",
            data
          );
        }
      );

      socket.on(
        "disconnect",
        () => {
          console.log(
            `🔴 User Disconnected`
          );
        }
      );
    }
  );
};

const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.io not initialized"
    );
  }

  return io;
};

module.exports = {
  initSocket,
  getIO,
};