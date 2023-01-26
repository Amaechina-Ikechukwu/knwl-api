const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const axios = require("axios");
const FormData = require("form-data");

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
const url = "https://api.unionavatars.com/avatars";
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

router.post("/", async (req, res) => {
  const user = {
    imageurl: req.body.imageurl,
  };
  axios({
    url: "https://api.remove.bg/v1.0/removebg",
    data: formData,
    method: "post",

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
      console.log(response);
      return;
    })
    .catch((error) => {
      return console.error("Request failed:", error);
    });
});

module.exports = router;
