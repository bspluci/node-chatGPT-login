require("dotenv").config();

const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const { db } = require("./models/Member");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const PORT = process.env.DB_PORT;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json({ extended: true }));
app.use(cors());

// socket.io 통신
const server = http.createServer(app);
const io = require("socket.io")(server, {
  // CORS 해결
  cors: {
    origin: "http://localhost:4000",
    credentials: true,
  },
});
module.exports = io;

mongoose.Promise = global.Promise;

app.get("/", (req, res) => {
  res.send("API RUNNING...");
});

connectDB();

app.use("/api/member", require("./routes/api/members"));

app.use("/api/todo", require("./routes/api/todos"));

app.use("/api/chat", require("./routes/api/chats"));

app.get("/html/nav", (req, res) => {
  res.sendFile(__dirname + "/html/nav.html");
});

app.get("/html/slider", (req, res) => {
  res.sendFile(__dirname + "/html/slider.html");
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

// MongoClient.connect(
//   "mongodb+srv://admin:44gjqj4$@cluster0.vajmcdx.mongodb.net/?retryWrites=true&w=majority",
//   (err, client) => {
//     if (err) return err;

//     db = client.db("myproject");

//     app.listen(8080, () => {
//       console.log("listening on 8080");
//     });

//     app.get("/node", (req, res) => {
//       res.send({ say: "how you doing??" });
//     });

//     app.get("/node/nav", (req, res) => {
//       res.sendFile(__dirname + "/html/nav.html");
//     });

//     app.get("/node/write", (req, res) => {
//       res.sendFile(__dirname + "/html/write.html");
//     });

//     app.post("/node/add", (req, res) => {
//       let { todoTitle, todoDate } = req.body;

//       db.collection("postCounter").findOne({ name: "게시물갯수" }, (err, result) => {
//         if (err) return err;
//         db.collection("post").insertOne({ _id: result.totalPost + 1, todoTitle, todoDate }, (err, result) => {
//           if (err) return err;
//           db.collection("postCounter").updateOne({ name: "게시물갯수" }, { $inc: { totalPost: 1 } }, (err, result) => {
//             if (err) return err;
//             res.status(200).send({ code: "OK", message: "요청이 성공하였습니다." });
//           });
//         });
//       });
//     });

//     app.get("/node/list", (req, res) => {
//       db.collection("post")
//         .find()
//         .toArray((err, result) => {
//           if (err) return err;
//           res.status(200).send({ code: "OK", message: "요청이 성공하였습니다.", data: result });
//         });
//     });

//     app.post("/node/del", (req, res) => {
//       db.collection("post").deleteOne({ _id: req.body.id }, (err, result) => {
//         if (err) return err;
//         res.status(200).send({ code: "OK", message: "요청이 성공하였습니다." });
//       });
//     });

//     app.get("/node/detail", (req, res) => {
//       db.collection("post").findOne({ _id: parseInt(req.query.id) }, (err, result) => {
//         if (err) return err;
//         res.send({ code: "OK", message: "요청이 성공하였습니다.", data: result });
//       });
//     });

//     app.post("/node/update", (req, res) => {
//       db.collection("post").updateOne(
//         { _id: parseInt(req.body.id) },
//         { $set: { todoDate: req.body.todoDate, todoTitle: req.body.todoTitle } },
//         (err, result) => {
//           if (err) return err;
//           res.status(200).send({ code: "OK", message: "요청이 성공하였습니다." });
//         }
//       );
//     });
//   }
// );
