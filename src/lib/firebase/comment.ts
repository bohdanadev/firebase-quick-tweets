import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  increment,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { IComment, IReplyComment } from "@/types";

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

export const getReplies = async (postId: string, commentId: string) => {
  const q = query(
    collection(db, "posts", postId, "comments", commentId, "replies")
  );
  return (await getDocs(q)).docs.map((doc) => {
    const id = doc.id;
    const data = doc.data() as Omit<IReplyComment, "id">;
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
    postId,
    userId,
    username,
    userImg,
    timestamp: serverTimestamp(),
  });
  await updateDoc(doc(db, "posts", postId), {
    commentsCount: increment(1),
  });
};

export const addReplyToComment = async (
  postId: string,
  commentId: string,
  comment: string,
  userId: string,
  username: string,
  userImg: any
) => {
  await addDoc(
    collection(db, "posts", postId, "comments", commentId, "replies"),
    {
      commentId,
      comment,
      userId,
      username,
      userImg,
      timestamp: serverTimestamp(),
    }
  );
  await updateDoc(doc(db, "posts", postId), {
    commentsCount: increment(1),
  });
};

export const deleteCommentWithReplies = async (
  postId: string,
  commentId: string
) => {
  const q = query(
    collection(db, "posts", postId, "comments", commentId, "replies")
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((reply) => {
    deleteDoc(
      doc(db, "posts", postId, "comments", commentId, "replies", reply.id)
    );
  });
  await deleteDoc(doc(db, "posts", postId, "comments", commentId));

  await updateDoc(doc(db, "posts", postId), {
    commentsCount: increment(-1),
  });
};

export const updateComment = async (
  postId: string,
  commentId: string,
  text: string
) => {
  await updateDoc(doc(db, "posts", postId, "comments", commentId), {
    comment: text,
  });
};
