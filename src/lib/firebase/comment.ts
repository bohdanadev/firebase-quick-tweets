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
    const data = doc.data() as Omit<IComment, "id">;
    const timestamp = doc.data().timestamp.toDate();
    return { id, ...data, timestamp };
  });
};
export const addComment = async (
  postId: string,
  comment: string,
  userId: string,
  username: string,
  userImg: any
) => {
  await addDoc(collection(db, "posts", postId, "comments"), {
    comment,
    userId,
    username,
    userImg,
    timestamp: serverTimestamp(),
  });
};
