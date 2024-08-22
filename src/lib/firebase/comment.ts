import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { IComment } from "@/types";

export const getComments = async (postId: string) => {
  const q = query(
    collection(db, "posts", postId, "comments"),
    orderBy("timestamp", "desc")
  );
  return (await getDocs(q)).docs.map((doc) => {
    const id = doc.id;
    const data = doc.data() as IComment;
    return { id, ...data };
  });
};
export const addComment = async (
  postId: string,
  comment: string,
  userId: string,
  username: string,
  tag: string,
  userImg: string
) => {
  await addDoc(collection(db, "posts", postId, "comments"), {
    comment,
    userId,
    username,
    tag: tag,
    userImg: userImg,
    timestamp: serverTimestamp(),
  });
};
