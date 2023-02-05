const { getAuth } = require("firebase-admin/auth");

const router = require("express").Router();
router.get("/", async (req, res) => {
  const { headers, body } = req;
  const token = headers.authorization.split(" ")[1];

  if (headers.authorization == null || headers.authorization == undefined) {
    res.json({ message: "please add headers" });
  } else {
    getAuth()
      .getUser(token)
      .then((result) =>
        res.status(200).json({ success: true, data: result.toJSON() })
      )
      .catch(() => {
        res.json("No user found");
      });
  }
});

module.exports = router;
