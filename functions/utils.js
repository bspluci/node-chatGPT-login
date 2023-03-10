module.exports.codeOk = {
  code: "OK",
  status: 200,
  message: "요청이 성공하였습니다.",
};

module.exports.codeErr = {
  code: "ERROR",
  status: 500,
  message: "Server Error",
};

module.exports.errorFun = (status, code, message) => {
  let error = new Error(message);
  code ? (error.status = status) : null;
  message ? (error.code = code) : null;

  return error;
};
