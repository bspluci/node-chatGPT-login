const router = require("express").Router();
const Todo = require("../../models/Todo");

router.post("/create", (req, res) => {
  Todo.createTodo(req.body)
    .then((todo) => {
      res.send({ code: "OK", message: "요청이 성공하였습니다." });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/list", (req, res) => {
  Todo.findAllTodo()
    .then((todos) => {
      if (!todos.length) return res.status(404).send({ err: "Todo not found" });
      res.send({ code: "OK", message: "요청이 성공하였습니다.", data: todos });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/list/detail", (req, res) => {
  Todo.findOneTodo(req.query.id)
    .then((todo) => {
      if (!todo) return res.status(404).send({ err: "Todo not found" });
      res.send({ code: "OK", message: "요청이 성공하였습니다.", data: todo });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post("/list/update", (req, res) => {
  Todo.updateTodo(req.body.id, req.body)
    .then((todo) => {
      res.send({ code: "OK", message: "요청이 성공하였습니다." });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post("/list/delete", (req, res) => {
  Todo.deleteTodo(req.body.id)
    .then((todo) => {
      res.send({ code: "OK", message: "요청이 성공하였습니다." });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
