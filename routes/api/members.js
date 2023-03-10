const Member = require("../../models/Member"); // Member model 불러오기
const router = require("express").Router();
const auth = require("../../middleware/auth");
const multerUpload = require("../../middleware/multerUpload");
const util = require("../../functions/utils");

router.post("/register", async (req, res) => {
  await Member.memberRegister(req.body)
    .then((user) => {
      res.status(200).send(util.codeOk);
    })
    .catch(({ code, status, message }) => {
      code ? res.status(status).send({ code, status, message }) : res.status(500).send(util.codeErr);
    });
});

router.post("/login", async (req, res) => {
  await Member.getUserByEmail(req.body)
    .then((token) => {
      res.status(200).send({ ...util.codeOk, ...{ token } });
    })
    .catch(({ code, status, message }) => {
      code ? res.status(status).send({ code, status, message }) : res.status(500).send(util.codeErr);
    });
});

router.post("/userInfo", auth, async (req, res) => {
  await Member.getUserInfoByToken(req.body)
    .then((data) => {
      res.status(200).send({ ...util.codeOk, ...{ data } });
    })
    .catch(({ code, status, message }) => {
      code ? res.status(status).send({ code, status, message }) : res.status(500).send(util.codeErr);
    });
});

// router.post("/profileImage", auth, multerUpload.array("image", 10), async (req, res) => {
router.post("/editMemberProfile", auth, multerUpload.single("image"), async (req, res) => {
  if (req.fileValidationError) {
    return res.status(404).send({ code: "upload file limits", status: 404, message: req.fileValidationError });
  }

  await Member.editMemberProfile(req)
    .then((data) => {
      res.status(200).send(util.codeOk);
    })
    .catch(({ code, status, message }) => {
      code ? res.status(status).send({ code, status, message }) : res.status(500).send(util.codeErr);
    });
});

router.get("/images/profile/:image", async (req, res) => {
  res.status(200).sendFile(process.env.PWD + `/images/profile/${req.params.image}`);
});

router.post("/allMemberList", auth, async (req, res) => {
  await Member.getAllMemberList(req.body)
    .then((data) => {
      res.status(200).send({ ...util.codeOk, ...{ data } });
    })
    .catch(({ code, status, message }) => {
      code ? res.status(status).send({ code, status, message }) : res.status(500).send(util.codeErr);
    });
});

module.exports = router;
