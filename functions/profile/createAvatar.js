const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

const FormData = require("form-data");
const { removeBackgroundFromImageUrl } = require("remove.bg");
const base64 = require("node-base64-image");
const fs = require("fs");
const getPixels = require("get-pixels");
const { extractColors } = require("extract-colors");
const { getAuth } = require("firebase-admin/auth");

router.post("/", async (req, res) => {
  const user = {
    imageurl: req.body.image_url,
    userId: req.body.user_id,
    // base64image: req.body.base64image,
  };
  const { authorization } = req.headers;
  const options = {
    string: true,
    headers: {
      "User-Agent": "my-app",
    },
  };
  let url;
  let authorized;

  try {
    if (authorization == null || authorization == undefined) {
      res.json({ message: "please add headers" });
    } else {
      await getAuth()
        .getUser(authorization.split(" ")[1])
        .then(() => (authorized = true))
        .catch((err) => res.json({ success: false, message: err }));
      if (authorized) {
        await base64
          .encode(user.imageurl, options)
          .then(
            async (resultencode) =>
              await base64
                .decode(resultencode, {
                  fname: __dirname + "/example" + user.userId,
                  ext: "jpg",
                })
                .then((resultdecode) => {
                  {
                  }
                })
                .catch((error) => {})
          )
          .catch((error) => {});
        const outputFile = `${__dirname}/example${user.userId}.jpg`;

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

        await admin
          .storage()
          .bucket()
          .upload(outputFile, {
            destination: "profile/" + "example" + user.userId + ".jpg",
          })
          .then((result) => {
            return;
          });
        await admin
          .storage()
          .bucket()
          .file("profile/" + "example" + user.userId + ".jpg")
          .getSignedUrl({ action: "read", expires: "03-09-2491" })
          .then((urls) => {
            const signedUrl = urls[0];

            url = signedUrl;
          })
          .catch((err) => {});
        getPixels(outputFile, async (err, pixels) => {
          if (!err) {
            const data = [...pixels.data];
            const width = Math.round(Math.sqrt(data.length / 4));
            const height = width;
            let colors = [];
            await extractColors({ data, width, height })
              .then((result) => {
                for (const key in result) {
                  colors.push(result[key]?.hex);
                }
                fs.unlink(outputFile, (err, res) => {});
                res.status(200).json({ colors, image_url: url });
              })
              .catch((err) => {});
          } else {
            {
            }
          }
        });
      } else {
        res.json({ success: false, message: "unauthorized" });
      }
    }
  } catch (e) {
    {
    }
  }
});

module.exports = router;
