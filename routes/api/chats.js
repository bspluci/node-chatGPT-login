const Chat = require("../../models/Chat"); // Member model 불러오기
const router = require("express").Router();
const auth = require("../../middleware/auth");

const codeOk = { code: "OK", status: 200, message: "요청이 성공하였습니다." };
const codeErr = { code: "ERROR", status: 500, message: "Server Error" };

router.post("/startUserChat", auth, async (req, res) => {
  await Chat.startUserChat(req)
    .then((data) => {
      res.status(200).send({ ...codeOk, ...{ data } });
    })
    .catch(({ code, status, message }) => {
      code ? res.status(status).send({ code, status, message }) : res.status(500).send(codeErr);
    });
});

module.exports = router;
