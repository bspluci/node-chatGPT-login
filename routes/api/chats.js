const Chat = require("../../models/Chat"); // Member model 불러오기
const ChatContent = require("../../models/ChatContent");
const router = require("express").Router();
const auth = require("../../middleware/auth");
const util = require("../../functions/utils");
const io = require("../../server");

router.post("/startUserChat", auth, async (req, res) => {
  await Chat.startUserChat(req)
    .then(async (data) => {
      await ChatContent.compareChatRoom(data)
        .then((data) => {
          res.status(200).send({ ...util.codeOk, ...{ data } });
        })
        .catch(({ code, status, message }) => {
          code ? res.status(status).send({ code, status, message }) : res.status(500).send(util.codeErr);
        });
    })
    .catch(({ code, status, message }) => {
      code ? res.status(status).send({ code, status, message }) : res.status(500).send(util.codeErr);
    });
});

router.post("/updateChatMessage", auth, async (req, res) => {
  await ChatContent.updateChatMessage(req.body)
    .then((data) => {
      res.status(200).send({ ...util.codeOk, ...{ data } });
    })
    .catch(({ code, status, message }) => {
      code ? res.status(status).send({ code, status, message }) : res.status(500).send(util.codeErr);
    });
});

router.get("/message", async (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const changeStream = ChatContent.watch();
  changeStream.on("change", (change) => {
    ChatContent.liveChatMessage(change, req.query.id).then((data) => {
      res.write("event: message\n");
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  });
});

// socket.io 통신
io.on("connection", (socket) => {
  // 채팅방 생성
  socket.on("작명", (data) => {
    socket.join(data);
  });

  // 상대 지정 채팅
  socket.on("작명", (data) => {
    io.to(socket.id).emit("message", message);
  });

  // 단체 채팅
  socket.on("message", (message) => {
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

module.exports = router;
