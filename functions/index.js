const functions = require("firebase-functions");
const express = require("express");
const service = require("./serviceaccountkey.json");
var cors = require("cors");
var app = express();
require("dotenv").config();

const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(service),
  storageBucket: process.env.storageBucket,
});
app.use(cors());
app.use(express.json());
const userRouter = require("./users/user");
const getUser = require("./users/readUsers");
const createAvatar = require("./profile/createAvatar");
const createuser = require("./users/createusers");
const getuser = require("./users/getusers");
const chatopenai = require("./chats/openai");
app.use("/user", userRouter);
app.use("/getusers", getUser);
app.use("/createavatar", createAvatar);
app.use("/createuser", createuser);
app.use("/getuser", getuser);
app.use("/chatopenai", chatopenai);

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
app.listen(3000, () => {
  console.log("Hey ikay, i am loaded");
});
//
// exports.knwl = functions.https.onRequest(app);
// const app1 = express();
// app1.get("*", (request, response) => {
//   response.send("Hello from Express on Firebase!");
// });

// const api1 = functions.https.onRequest(app1);

// module.exports = {
//   api1,
