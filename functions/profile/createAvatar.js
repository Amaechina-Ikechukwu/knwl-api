const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const axios = require("axios");
const FormData = require("form-data");
const { removeBackgroundFromImageUrl } = require("remove.bg");
const base64 = require("node-base64-image");
const fs = require("fs");
const getPixels = require("get-pixels");
const { extractColors } = require("extract-colors");

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
    imageurl: req.body.base64image,
    userId: req.body.user_id,
    // base64image: req.body.base64image,
  };

  const stream = fs.createReadStream(`example${user.userId}.jpg`);
  const options = {
    string: true,
    headers: {
      "User-Agent": "my-app",
    },
  };
  console.log(req.body);
  // const image = await base64.encode(user.imageurl, options);
  let blob;
  try {
    await base64.decode(user.imageurl, {
      fname: "example" + user.userId,
      ext: "jpg",
    });
    // await removeBackgroundFromImageUrl({
    //   url: user.imageurl,
    //   apiKey,
    //   size: "regular",
    //   type: "person",
    //   outputFile,
    // })
    //   .then(async (result) => {
    //     console.log(`File saved to ${outputFile}`);
    //     return;
    //   })
    //   .catch((errors) => {
    //     console.log(JSON.stringify(errors));
    //     return;
    //   });

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
    const outputFile = `${__dirname}/example${user.userId}.jpg`;
    await getPixels(outputFile, async (err, pixels) => {
      if (!err) {
        const data = [...pixels.data];
        const width = Math.round(Math.sqrt(data.length / 4));
        const height = width;
        let colors = [];
        return extractColors({ data, width, height })
          .then((result) => {
            for (const key in result) {
              colors.push(result[key]?.hex);
            }
            // return colors;
            res.status(200).json({ colors }, user.imageurl);
          })
          .catch((err) => console.log(err));
      }
    });
  } catch (e) {
    console.log({ e });
  }
});

module.exports = router;
