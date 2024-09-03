import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import next from "next";

admin.initializeApp();
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
  conf: {
    distDir: ".next",
  },
});
const handle = app.getRequestHandler();

exports.nextApp = functions.https.onRequest(async (req, res) => {
  await app.prepare();
  return await handle(req, res);
});
