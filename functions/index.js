const functions = require("firebase-functions");
const express = require("express");
const service = require("./serviceaccountkey.json");
const app = express();
const admin = require("firebase-admin");
admin.initializeApp({ credential: admin.credential.cert(service) });

const userRouter = require("./users/user");
const getUser = require("./users/readUsers");
const createAvatar = require("./profile/createAvatar");
app.use("/user", userRouter);
app.use("/getusers", getUser);
app.use("/createavatar", createAvatar);

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
exports.knwl = functions.https.onRequest(app);
// const app1 = express();
// app1.get("*", (request, response) => {
//   response.send("Hello from Express on Firebase!");
// });

// const api1 = functions.https.onRequest(app1);

// module.exports = {
//   api1,
// };
