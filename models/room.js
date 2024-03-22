const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  roomId: { type: String, required: true },
  messages: [
    {
      messageId: {
        type: Schema.Types.ObjectId,
        ref: "Message",
        required: true,
      },
    },
  ],
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Room", roomSchema);
