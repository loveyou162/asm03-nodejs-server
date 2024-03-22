const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const messageSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  content: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enums: ["client", "admin"],
  },
  roomId: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Message", messageSchema);
