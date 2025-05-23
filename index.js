const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const shortid = require("shortid");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/shorten", async (req, res) => {
  const { originalUrl } = req.body;
  const code = shortid.generate();

  await db.collection("urls").doc(code).set({
    originalUrl,
    createdAt: new Date(),
    clicks: 0
  });

  res.send({ shortUrl: `https://quick-url-shortner-a96ca.web.app/${code}` });
});

app.get("/:code", async (req, res) => {
  const code = req.params.code;
  const doc = await db.collection("urls").doc(code).get();

  if (!doc.exists) {
    return res.status(404).send("URL not found");
  }

  const data = doc.data();
  await db.collection("urls").doc(code).update({ clicks: data.clicks + 1 });
  res.redirect(data.originalUrl);
});

exports.api = functions.region('us-central1').https.onRequest(app);
