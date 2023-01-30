const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const axios = require("axios");
const FormData = require("form-data");
const { removeBackgroundFromImageUrl } = require("remove.bg");
const outputFile = `${__dirname}/out/img-removed-from-file.png`;
const colorExtractor = require("img-color-extractor");
const fs = require("fs");

const formData = new FormData();
formData.append("size", "auto");
formData.append("image_url", "https://www.remove.bg/example.jpg");

const removebg = (imageurl) => {
  axios({
    method: "post",

    url: "https://api.remove.bg/v1.0/removebg",
    data: formData,

    responseType: "arraybuffer",
    headers: {
      ...formData.getHeaders(),
      "X-Api-Key": apiKey,
    },
    encoding: null,
  })
    .then(function (response) {
      if (response.status != 200)
        return console.error("Error:", response.status, response.statusText);
      return response.data;
    })
    .catch((error) => {
      return console.error("Request failed:", error);
    });
};

const apiKey = "4AnaC3AYhBNREKNBYPxQGAVo";

const extractcolor = () => {
  const options = {
    method: "POST",
    url: "https://color-extractor-for-apparel2.p.rapidapi.com/background",
    headers: {
      "content-type": "application/json",
      Accept: "image/png",
      "X-RapidAPI-Key": "SIGN-UP-FOR-KEY",
      "X-RapidAPI-Host": "color-extractor-for-apparel2.p.rapidapi.com",
    },
    data: '{"image":{"url":"https://cdn.arstechnica.net/wp-content/uploads/2016/02/5718897981_10faa45ac3_b-640x624.jpg"}}',
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
};

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

router.post("/", async (req, res) => {
  const user = {
    imageurl: req.body.image_url,
    userId: req.body.user_id,
  };
  const outputFile = `${__dirname}/${user.userId}.png`;
  const stream = fs.createReadStream(
    `Users/user/projects/knwl-api/functions/profile/${user.userId}.png`
  );
  console.log(user.imageurl);

  let blob;
  const image = await removeBackgroundFromImageUrl({
    url: user.imageurl,
    apiKey,
    size: "regular",
    type: "person",
    outputFile,
  })
    .then(async (result) => {
      // console.log(`File saved to ${outputFile}`);
      colorExtractor.extract(stream).then((colors) => {
        console.log(colors);
      });
      return;
    })
    .catch((errors) => {
      console.log(JSON.stringify(errors));
      return;
    });

  // await admin
  //   .storage()
  //   .bucket()
  //   .upload(outputFile, {
  //     destination: "profile/" + user.userId + ".png",
  //   })
  //   .then((result) => {
  //     return;
  //   });
  // await admin
  //   .storage()
  //   .bucket()
  //   .file("profile/" + user.userId + ".png")
  //   .getSignedUrl({ action: "read", expires: "03-09-2491" })
  //   .then((urls) => {
  //     const signedUrl = urls[0];
  //     console.log({ signedUrl });
  //     res.json({ url: signedUrl });
  //   });
});

module.exports = router;
