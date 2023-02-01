const router = require("express").Router();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
router.post("/", async (req, res) => {
  const { message } = req.body;
  await openai
    .createCompletion({
      model: "text-davinci-002",
      prompt: message,
    })
    .then((result) => {
      res
        .status(200)
        .json({ success: true, message: result.data.choices[0].text });
    })
    .catch((error) => {
      res.json({ success: false, message: error });
    });
});
module.exports = router;
