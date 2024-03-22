const { Server } = require("socket.io");
const Message = require("../models/chat");
const Room = require("../models/room");

// Function to initialize Socket.IO
const initSocketIO = (server) => {
  // Create a new instance of Socket.IO and pass the server instance to it
  //   console.log(5, server);
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3001",
        "http://localhost:3000",
        "http://localhost:3002",
        "https://admin-nodejs-03-4a9f5.web.app",
        "https://client-nodejs-03-41bd8.web.app",
      ],
      methods: ["GET", "POST"],
    },
  });

  // Handle connections
  io.on("connection", (socket) => {
    console.log("Client connected", socket.id);
    socket.on("newRoomId", async (data) => {
      console.log(37, data);
      if (data.newRoomId) {
        const newRoom = new Room({
          roomId: data.newRoomId,
          messages: [],
          userId: data.user,
        });
        await newRoom.save();
      }
    });
    socket.on("clientSendMessage", async (data) => {
      console.log(37, data);
      try {
        //tạo message mới khi có tin nhắn mới
        const newMessage = new Message({
          content: data.message,
          userId: data.user,
          roomId: data.roomId,
          role: data.role,
        });
        await newMessage.save();

        //tìm kiếm room với roomId và thêm tin nhắn mới vào room đó => room ban đầu của user
        let room = await Room.findOne({ roomId: data.roomId }).populate(
          "messages.messageId"
        );
        console.log(40, room);
        room.messages.push({ messageId: newMessage._id });

        //nếu người dùng nhập tin nhắn là /end xóa toàn bộ và kết thúc cuộc trò chuyện
        if (data.message === "/end") {
          await Room.deleteOne({ roomId: data.roomId });
          await Message.deleteMany({
            $or: [
              { roomId: data.roomId }, // Tin nhắn có roomId
              { roomId: null }, // Tin nhắn có roomId là null
            ],
          });
          io.emit("removeRoom", { remove: "remove-room" });
        }
        await room.save();
        const selectedRoom = await Room.findOne({ userId: data.user }).populate(
          "messages.messageId"
        );
        console.log(66, selectedRoom);

        //gửi tin nhắn cho toàn bộ client và admin
        io.emit("clientReceiveMessage", {
          message: newMessage,
          roomId: selectedRoom.roomId,
          room: selectedRoom,
          user: data.user,
        });
      } catch (err) {
        console.log(err);
      }
    });
    // Handle disconnections
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

// Export the function to initialize Socket.IO
module.exports = initSocketIO;
