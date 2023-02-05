const admin = require("firebase-admin");
const router = require("express").Router();
const db = admin.firestore();
router.get("/", async (req, res) => {
  let usersList = [];
  const usersRef = db.collection("users");
  const snapshot = await usersRef.get();
  snapshot.forEach((doc) => {
    usersList.push(doc.id);
  });
  res.status(200).send(usersList);
});

module.exports = router;
