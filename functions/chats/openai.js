const router = require("express").Router();
const { Configuration, OpenAIApi } = require("openai");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const addToFirestore = (user) => {
  admin
    .firestore()
    .collection("chats")
    .doc(authorization.split(" ")[1])
    .collection("chats")
    .doc("openai")
    .set({
      message: user.message,
      timestamp: FieldValue.serverTimestamp(),
      isRead: false,
    });
};

router.post("/", async (req, res) => {
  const { message } = req.body;
  const { authorization } = req.headers;

  await admin
    .firestore()
    .collection("chats")
    .doc(authorization.split(" ")[1])
    .collection("openai")
    .doc()
    .set({
      message,
      timestamp: FieldValue.serverTimestamp(),
      isRead: false,
      uid: authorization.split(" ")[1],
    })
    .then((result) => console.log({ result }))
    .catch((error) => console.log({ error }, "from first await"));
  await openai
    .createCompletion({
      model: "text-davinci-002",
      prompt: message,
    })
    .then(async (result) => {
      await admin
        .firestore()
        .collection("chats")
        .doc(authorization.split(" ")[1])
        .collection("openai")
        .doc()
        .set({
          message: result.data.choices[0].text,
          timestamp: FieldValue.serverTimestamp(),
          isRead: false,
          uid: "openai",
        })
        .then((result) => console.log({ result }), res.json({ success: true }))
        .catch((error) => console.log({ error }));
    })
    .catch((error) => {
      res.json({ success: false, message: error });
    });
});
module.exports = router;
