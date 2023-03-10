const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");

// dotenv.config();

module.exports = function (req, res, next) {
  // 인증 완료
  try {
    // 요청 헤더에 저장된 토큰과 비밀키를 사용하여 토큰을 req.decoded에 반환
    const key = process.env.SECRET_KEY;
    const token = req.header("x-auth-token");

    req.decoded = jwt.verify(token, key);
    req.user = req.decoded;

    return next();
  } catch (error) {
    // 인증 실패
    // 유효시간이 초과된 경우
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        code: 403,
        status: "Token Expired Error",
        message: "토큰이 만료되었습니다.",
      });
    }
    // 토큰의 비밀키가 일치하지 않는 경우
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        code: 401,
        status: "JsonWeb Token Error",
        message: "유효하지 않은 토큰입니다.",
      });
    }
  }
};
