// /**
//  * Import function triggers from their respective submodules:
//  *
//  * import {onCall} from "firebase-functions/v2/https";
//  * import {onDocumentWritten} from "firebase-functions/v2/firestore";
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */
// import { initializeApp } from "firebase-admin/app";
// import { onObjectFinalized } from "firebase-functions/v2/storage";
// import { getStorage } from "firebase-admin/storage";
// import * as path from "path";
// import * as logger from "firebase-functions/logger";

// // library for image resizing
// import sharp = require("sharp");

// initializeApp();

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

// // export const helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });

// exports.generateThumbnail = onObjectFinalized({ cpu: 2 }, async (event) => {
//   const fileBucket = event.data.bucket; // Storage bucket containing the file.
//   const filePath = event.data.name; // File path in the bucket.
//   const contentType = event.data.contentType; // File content type.

//   // Exit if this is triggered on a file that is not an image.
//   if (!contentType?.startsWith("image/")) {
//     return logger.log("This is not an image.");
//   }
//   // Exit if the image is already a thumbnail.
//   const fileName = path.basename(filePath);
//   if (fileName.startsWith("thumb_")) {
//     return logger.log("Already a Thumbnail.");
//   }

//   // Download file into memory from bucket.
//   const bucket = getStorage().bucket(fileBucket);
//   const downloadResponse = await bucket.file(filePath).download();
//   const imageBuffer = downloadResponse[0];
//   logger.log("Image downloaded!");

//   // Generate a thumbnail using sharp.
//   const thumbnailBuffer = await sharp(imageBuffer)
//     .resize({
//       width: 500,
//       height: 500,
//       withoutEnlargement: true,
//     })
//     .toBuffer();
//   logger.log("Thumbnail created");

//   // Prefix 'thumb_' to file name.
//   const thumbFileName = `thumb_${fileName}`;
//   const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);

//   // Upload the thumbnail.
//   const metadata = { contentType: contentType };
//   await bucket.file(thumbFilePath).save(thumbnailBuffer, {
//     metadata: metadata,
//   });
//   return logger.log("Thumbnail uploaded!");
// });

import { initializeApp } from "firebase-admin/app";
import { onObjectFinalized } from "firebase-functions/v2/storage";
import { getStorage } from "firebase-admin/storage";
import * as logger from "firebase-functions/logger";
import sharp = require("sharp");

initializeApp();

exports.generateThumbnail = onObjectFinalized({ cpu: 2 }, async (event) => {
  const fileBucket = event.data.bucket; // Storage bucket containing the file.
  const filePath = event.data.name; // File path in the bucket.
  const contentType = event.data.contentType; // File content type.

  // Exit if this is triggered on a file that is not an image.
  if (!contentType?.startsWith("image/")) {
    return logger.log("This is not an image.");
  }

  // Download file into memory from the bucket.
  const bucket = getStorage().bucket(fileBucket);
  const downloadResponse = await bucket.file(filePath).download();
  const imageBuffer = downloadResponse[0];
  logger.log("Image downloaded!");

  // Generate a thumbnail using sharp.
  const thumbnailBuffer = await sharp(imageBuffer)
    .resize({
      width: 500,
      height: 500,
      withoutEnlargement: true,
    })
    .toBuffer();
  logger.log("Thumbnail created");

  // Replace the original file with the thumbnail.
  const metadata = { contentType: contentType };
  await bucket.file(filePath).save(thumbnailBuffer, {
    metadata: metadata,
  });
  logger.log("Original image replaced with thumbnail");

  // Optionally, you can also rename the file to indicate it's a thumbnail.
  // However, this step is usually not necessary if you intend to replace the original file.
  // await bucket.file(thumbFilePath).delete();
  // await bucket.file(thumbFilePath).move(filePath);

  return logger.log("Thumbnail uploaded!");
});
