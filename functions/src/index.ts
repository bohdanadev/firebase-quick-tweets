import { initializeApp } from "firebase-admin/app";
import { onObjectFinalized } from "firebase-functions/v2/storage";
const { onSchedule } = require("firebase-functions/v2/scheduler");
import { getStorage } from "firebase-admin/storage";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import * as path from "path";
import sharp from "sharp";
import { firestore } from "firebase-admin";

initializeApp();

export const aggregateTrendingTopics = onSchedule(
  "every day 00:00",
  async () => {
    try {
      const db = firestore();
      const postsRef = db.collection("posts");

      const topLikedPostsSnapshot = await postsRef
        .orderBy("likesCount", "desc")
        .limit(3)
        .get();

      const topLikedPosts = topLikedPostsSnapshot.docs.map((doc) => doc.data());

      const topDiscussedPostsSnapshot = await postsRef
        .orderBy("commentsCount", "desc")
        .limit(3)
        .get();

      const topDiscussedPosts = topDiscussedPostsSnapshot.docs.map((doc) =>
        doc.data()
      );

      await db.collection("trending").doc("topics").set({
        topLikedPosts,
        topDiscussedPosts,
        lastUpdated: firestore.FieldValue.serverTimestamp(),
      });

      functions.logger.log("Trending topics aggregated successfully");
    } catch (error) {
      functions.logger.error("Error aggregating trending topics:", error);
    }
  }
);

exports.generateThumbnail = onObjectFinalized({ cpu: 2 }, async (event) => {
  const fileBucket = event.data.bucket;
  const filePath = event.data.name;
  const contentType = event.data.contentType;

  if (!contentType?.startsWith("image/")) {
    return logger.log("This is not an image.");
  }

  const fileName = path.basename(filePath);
  if (fileName.startsWith("thumb_")) {
    return logger.log("Already a Thumbnail.");
  }

  const bucket = getStorage().bucket(fileBucket);
  const downloadResponse = await bucket.file(filePath).download();
  const imageBuffer = downloadResponse[0];
  logger.log("Image downloaded!");

  const thumbnailBuffer = await sharp(imageBuffer)
    .resize({
      width: 300,
      height: 300,
      withoutEnlargement: true,
    })
    .toBuffer();
  logger.log("Thumbnail created");

  const thumbFileName = `thumb_${fileName}`;
  const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);

  const metadata = { contentType: contentType };
  await bucket.file(thumbFilePath).save(thumbnailBuffer, {
    metadata: metadata,
  });
  return logger.log("Thumbnail uploaded!");
});
