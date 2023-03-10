const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // 암호화 모듈
const jwt = require("jsonwebtoken");
const fs = require("fs");
const errorFun = require("../functions/utils").errorFun;

// Schema 생성
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordRe: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
    },
    profile: {
      type: String,
    },
    receiveMsg: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.statics.memberRegister = async function (payload) {
  const { name, email, password, passwordRe, phoneNumber } = payload;
  const emailReg =
    /^([\w\.\_\-])*[a-zA-Z0-9]+([\w\.\_\-])*([a-zA-Z0-9])+([\w\.\_\-])+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/;
  if (!name) throw errorFun(404, "empty name", "이름을 입력해주세요.");
  if (!email) throw errorFun(404, "empty email", "이메일을 입력해주세요.");
  if (!emailReg.test(email)) throw errorFun(404, "wrong email format", "잘못된 이메일 형식입니다.");
  if (!password) throw errorFun(404, "empty password", "비밀번호를 입력해주세요.");
  if (!passwordRe) throw errorFun(404, "empty passwordRe", "비밀번호 확인을 입력해주세요.");
  if (password !== passwordRe) throw errorFun(404, "Different password", "비밀번호가 다릅니다.");
  if (!phoneNumber) throw errorFun(404, "empty phoneNumber", "전화번호를 입력해주세요.");

  // // email을 비교하여 user가 이미 존재하는지 확인
  let user = await this.findOne({ email });
  if (user) throw errorFun(404, "duplicate email", "중복된 이메일이 존재합니다.");

  delete payload.passwordRe;
  user = new this(payload);
  // password를 암호화 하기
  let salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.profile = "/api/member/images/profile/default.jpeg";

  await user.save();
};

UserSchema.statics.getUserByEmail = async function (payload) {
  const user = await this.findOne({ email: payload.email });
  if (!user) throw errorFun(401, "not found email", "존재하지 않는 이메일주소입니다.");

  const password = await bcrypt.compare(payload.password, user.password);
  if (!password) throw errorFun(401, "wrong password", "잘못된 비밀번호입니다.");

  const key = process.env.SECRET_KEY;
  const profile = "images";
  const token = jwt.sign(
    {
      type: "JWT",
      nickname: user.email,
      profile: profile,
    },
    key,
    {
      expiresIn: "12h",
      issuer: "loginUser",
    }
  );

  return token;
};

UserSchema.statics.getUserInfoByToken = async function (payload) {
  const user = await this.findOne({ email: payload.email }).select(["-password", "-__v"]);
  return user;
};

UserSchema.statics.editMemberProfile = async function (payload) {
  let memberInfo = {
    name: payload.body.name,
    email: payload.body.email,
    phone: payload.body.phone,
    receiveMsg: payload.body.receiveMsg,
  };

  if (payload.file) {
    let profileUrl = await this.findOne({ _id: payload.body._id });

    if (profileUrl.profile) {
      // 기존 프로필 이미지가 있다면 삭제
      let fileName = profileUrl.profile.split("/");
      fileName = fileName[fileName.length - 1];

      fs.unlink(`./images/profile/${fileName}`, (err) => {
        if (err) return console.log(err);

        console.log("파일이 성공적으로 삭제되었습니다.");
      });

      memberInfo.profile = `/api/member/images/profile/${payload.file.filename}`;
    }
  }

  // { new: true }: 원본이 아닌 수정된 문서를 반환합니다. 기본값은 거짓
  return await this.findOneAndUpdate({ _id: payload.body._id }, memberInfo, { new: true });
};

UserSchema.statics.getAllMemberList = async function (payload) {
  let memberList =
    payload.condition === "ALL" ? await this.find({ _id: { $ne: payload._id } }).select(["-__v", "-password"]) : null;
  return memberList;
};

module.exports = mongoose.model("member", UserSchema);
