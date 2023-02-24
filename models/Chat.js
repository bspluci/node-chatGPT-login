const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // 암호화 모듈
const jwt = require("jsonwebtoken");
const Member = require("./Member");
const { ObjectId } = require("mongodb");

// Schema 생성
const ChatSchema = new mongoose.Schema(
  {
    chatUser: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let errorFun = (status, code, message) => {
  let error = new Error(message);
  code ? (error.status = status) : null;
  message ? (error.code = code) : null;

  return error;
};

ChatSchema.statics.startUserChat = async function (payload) {
  let user = await Member.findOne({ email: payload.user.nickname });
  let chatUser = [user._id, ObjectId(payload.body._id)];
  let findRoom = await this.findOne({ chatUser: { $all: chatUser } });

  if (findRoom) {
    return findRoom;
  } else {
    const chat = new this(payload);
    chat.chatUser = chatUser;
    return chat.save();
  }
};

module.exports = mongoose.model("chat", ChatSchema);
