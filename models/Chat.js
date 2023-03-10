const mongoose = require("mongoose");
const Member = require("./Member");
const { ObjectId } = require("mongodb");

// Schema 생성
const ChatSchema = new mongoose.Schema(
  {
    chatUser: {
      type: Array,
      required: true,
    },
    userId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

ChatSchema.statics.startUserChat = async function (payload) {
  const user = await Member.findOne({ email: payload.user.nickname });
  const chatUser = [user._id, ObjectId(payload.body._id)];
  const findRoom = await this.findOne({ chatUser: { $all: chatUser } });

  if (findRoom) {
    return findRoom;
  } else {
    const chat = new this(payload);
    chat.chatUser = chatUser;
    chat.userId = user._id;
    return await chat.save();
  }
};

module.exports = mongoose.model("chat", ChatSchema);
