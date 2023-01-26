const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const functions = require("firebase-functions");

router.post("/", async (req, res) => {
  const user = {
    firstname: req.body["firstname"],
    password: req.body["password"],
  };
  await admin
    .firestore()
    .collection("users")
    .doc()
    .set(user)
    .then((result) => {
      res.status(200).json(result);
    });
  // console.log({ registerUser });
  // return res.status(200).json(registerUser);
});

module.exports = router;
