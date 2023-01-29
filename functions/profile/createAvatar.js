const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const axios = require("axios");
const FormData = require("form-data");
const { removeBackgroundFromImageUrl } = require("remove.bg");

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
  console.log(user.imageurl);
  // formData.append("image_url", "https://www.remove.bg/example.jpg");
  // const url = "https://api.remove.bg/v1.0/removebg";
  // const options = {
  //   method: "POST",
  //   body: formData,
  //   headers: {
  //     "X-Api-Key": apiKey,
  //   },
  // };
  let blob;
  const image = await removeBackgroundFromImageUrl({
    url: user.imageurl,
    apiKey,
    size: "regular",
    type: "person",
  })
    .then(async (result) => {
      return Buffer.from(result.base64img, "base64");
      // return new Blob([new Uint8Array(base64img)], { type: "image/png" });
    })
    .catch((errors) => {
      console.log(JSON.stringify(errors));
      return;
    });

  await admin
    .storage()
    .bucket()
    .upload(image, {
      destination: "profile/" + user.userId,
    })
    .then((result) => {
      console.log(result);
      return;
    });
  // fetch(url, options)
  //   .then((res) => res.json())
  //   .then((json) => console.log(json))
  //   .catch((err) => console.error("error:" + err));
  // try {
  //   let response = await fetch(url, options);
  //   response = await response.json();
  //   res.status(200).json(response);
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ msg: `Internal Server Error.` });
  // }
});

module.exports = router;
