const router = require("express").Router();
const { getAuth } = require("firebase-admin/auth");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  getAuth()
    .createUser({
      email: email,
      emailVerified: false,
      password: password,
    })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.

      res.json({ success: true, userId: userRecord.uid });
    })
    .catch((error) => {
      res.json({ success: false, error: error });
    });
});

module.exports = router;
