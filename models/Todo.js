const mongoose = require("mongoose");
const autoIncrementModelID = require("./TodoCount");
const errorFun = require("../functions/utils").errorFun;

// Schema 생성
const TodoSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      min: 1,
    },
    user: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

TodoSchema.pre("save", function (next) {
  if (!this.isNew) {
    next();
    return;
  }

  autoIncrementModelID("activities", this, next);
});

// Create new todo document
TodoSchema.statics.createTodo = async function (payload) {
  // this === Model
  const todo = await new this(payload);
  // return Promise
  return todo.save();
};

// Find All
TodoSchema.statics.findAllTodo = async function () {
  // return promise
  // V4부터 exec() 필요없음
  return await this.find({}).select(["-__v", "-_id"]);
};

// Find one by todoid
TodoSchema.statics.findOneTodo = async function (id) {
  const todo = await this.findOne({ id });

  if (!todo) throw errorFun(404, "content inconsistency", "일치하는 내용이 없습니다.");

  return todo;
};

// Update by todoid
TodoSchema.statics.updateTodo = async function (id, payload) {
  // { new: true }: 원본이 아닌 수정된 문서를 반환합니다. 기본값은 거짓
  return await this.findOneAndUpdate({ id }, payload, { new: true });
};

TodoSchema.statics.deleteTodo = async function (payload) {
  const { id, user } = payload;

  return await this.deleteOne({ id, user });
};

TodoSchema.statics.searchByTitle = async function (title) {
  let serachCondition = [
    {
      $search: {
        index: "titleSearch",
        text: {
          query: title,
          path: ["title"],
        },
      },
    },
    // { $sort: { id: -1 } }, // id 정렬
    // { $limit: 5 },

    // 검색관련 점수를 매겨 높은순으로 정렬해 보냄 default 값임
    // { $project: { title: 1, id: 1, date: 1, completed: 1, _id: 0, score: { $meta: "searchScore" } } },
  ];

  // 검색어가 있다면 indexing 사용, 없다면 regex 사용
  return title ? await this.aggregate(serachCondition) : await this.find({ title: { $regex: title, $options: "i" } });
};

module.exports = mongoose.model("todo", TodoSchema);
