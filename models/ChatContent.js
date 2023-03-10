const mongoose = require("mongoose");
const Member = require("./Member");
const Chat = require("./Chat");
const { ObjectId } = require("mongodb");

// Schema 생성
const ChatContentSchema = new mongoose.Schema(
  {
    _id: {
      type: ObjectId,
      required: true,
    },
    chatMessage: {
      type: Array,
    },

    userId: { type: String },
    userName: { type: String },
    userProfile: { type: String },

    targetId: { type: String },
    targetName: { type: String },
    targetProfile: { type: String },
  },
  {
    // timestamps: true,
  }
);

ChatContentSchema.statics.compareChatRoom = async function (payload) {
  let chatContent = { _id: payload._id };

  payload.chatUser.map((item) => {
    item.equals(ObjectId(payload.userId)) ? (chatContent.userId = item) : (chatContent.targetId = item);
  });

  const user = await Member.findOne({ _id: ObjectId(chatContent.userId) });
  const target = await Member.findOne({ _id: ObjectId(chatContent.targetId) });

  const roomIfon = await this.findOneAndUpdate(
    { _id: payload._id }, // 찾을 문서를 식별하는 필터
    {
      $set: {
        userId: user._id,
        userName: user.name,
        userProfile: user.profile,
        targetId: target._id,
        targetName: target.name,
        targetProfile: target.profile,
      },
    }, // 업데이트할 필드와 값
    { new: true, upsert: true } // 옵션
  ).select("-__v");

  return roomIfon;
};

ChatContentSchema.statics.updateChatMessage = async function (payload) {
  const chatInfo = {
    message: payload.chatMessage.message,
    chatId: payload.myId,
  };
  const roomInfo = await this.findOneAndUpdate(
    { _id: payload.roomId },
    { $push: { chatMessage: chatInfo } },
    { new: true }
  ).select(["-_id", "-__v"]);

  return roomInfo;
};

ChatContentSchema.statics.liveChatMessage = async function (change, roomId) {
  if (change.operationType === "insert" || change.operationType === "update") {
    const message = await this.findOne({ _id: roomId });
    return message;
  }
};

module.exports = mongoose.model("chatContent", ChatContentSchema);
