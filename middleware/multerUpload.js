const multer = require("multer");

// 이미지 업로드
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/profile");
  },
  filename: function (req, file, cb) {
    let extensions = file.mimetype.split("/")[1];
    cb(null, `myProfileImage${Date.now()}.${extensions}`);
  },
  limits: function (req, file, cb) {},
});

const fileFilter = (req, file, cb) => {
  const typeArray = file.mimetype.split("/");
  const fileType = typeArray[1];

  if (fileType == "jpg" || fileType == "png" || fileType == "jpeg" || fileType == "gif" || fileType == "webp") {
    req.fileValidationError = null;
    cb(null, true);
  } else {
    req.fileValidationError = "jpg,jpeg,png,gif,webp 파일만 업로드 가능합니다.";
    cb(null, false);
  }
};

let multerUpload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = multerUpload;
