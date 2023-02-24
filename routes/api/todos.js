const router = require("express").Router();
const Todo = require("../../models/Todo");
const auth = require("../../middleware/auth");

router.use(auth); // 문서내 모든 라우터에 미들웨어 실행

const codeOk = { code: "OK", status: 200, message: "요청이 성공하였습니다." };
const codeErr = { code: "ERROR", status: 500, message: "Server Error" };

router.post("/create", (req, res) => {
  Todo.createTodo(req.body)
    .then((todo) => {
      res.status(200).send(codeOk);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/list", (req, res) => {
  Todo.findAllTodo()
    .then((todos) => {
      res.status(200).send({ ...codeOk, ...{ data: todos } });
    })
    .catch((err) => {
      res.status(500).send(codeErr);
    });
});

router.get("/list/detail", (req, res) => {
  Todo.findOneTodo(req.query.id)
    .then((todo) => {
      res.status(200).send({ ...codeOk, ...{ data: todo } });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post("/list/update", (req, res) => {
  Todo.updateTodo(req.body.id, req.body)
    .then((todo) => {
      res.status(200).send(codeOk);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post("/list/delete", (req, res) => {
  Todo.deleteTodo(req.body)
    .then((todo) => {
      todo.deletedCount > 0
        ? res.status(200).send(codeOk)
        : res.status(401).send({ code: "ERROR", status: 401, message: "회원정보가 일치하지 않아 삭제할 수 없습니다." });
    })
    .catch(({ code, status, message }) => {
      code ? res.status(status).send({ code, status, message }) : res.status(500).send(codeErr);
    });
});

router.get("/search", (req, res) => {
  if (!req.query.title)
    return res.status(401).send({ code: "not found text", status: 401, message: "검색어를 입력해주세요." });

  Todo.searchByTitle(req.query.title)
    .then((data) => {
      res.status(200).send({ ...codeOk, ...{ data } });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
