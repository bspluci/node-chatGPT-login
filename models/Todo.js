const mongoose = require("mongoose");
const autoIncrementModelID = require("./TodoCount");

// Schema 생성
const TodoSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      min: 1,
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
TodoSchema.statics.createTodo = function (payload) {
  // this === Model
  const todo = new this(payload);
  // return Promise
  return todo.save();
};

// Find All
TodoSchema.statics.findAllTodo = function () {
  // return promise
  // V4부터 exec() 필요없음
  return this.find({});
};

// Find one by todoid
TodoSchema.statics.findOneTodo = function (id) {
  return this.findOne({ id });
};

// Update by todoid
TodoSchema.statics.updateTodo = function (id, payload) {
  // { new: true }: 원본이 아닌 수정된 문서를 반환합니다. 기본값은 거짓
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

TodoSchema.statics.deleteTodo = function (id) {
  return this.deleteOne({ id });
};

// model을 export 해주기
module.exports = mongoose.model("todo", TodoSchema);
