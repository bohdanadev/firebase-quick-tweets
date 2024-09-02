import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "./firebase";

export const getImageUrl = async (
  imagePath: string,
  imageFile: any
  //  thumbPath: string
) => {
  const imageRef = ref(storage, imagePath);
  await uploadBytes(imageRef, imageFile);
  //  const thumbRef = ref(storage, thumbPath);
  //return await getDownloadURL(thumbRef);
  return await getDownloadURL(imageRef);
};

export const deleteImageInStorage = async (
  currentImageUrl: string
  //   thumbPath: string
) => {
  const currentImageRef = ref(storage, currentImageUrl);
  try {
    await deleteObject(currentImageRef);
    console.log("Image Deleted");
  } catch (error) {
    throw new Error("Failed delete image!");
  }

  //  const thumbRef = ref(storage, thumbPath);
  //  await deleteObject(thumbRef);
};
