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
  getDoc,
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
    collection(db, "posts", postId, "comments", commentId, "replies"),
    orderBy("timestamp", "desc")
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
  const docRef = await addDoc(collection(db, "posts", postId, "comments"), {
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
  const newComment = await getDoc(docRef);
  const id = newComment.id;
  const data = newComment.data() as Omit<IComment, "id">;
  const timestamp = newComment.data()?.timestamp.toDate();
  return { id, ...data, timestamp };
};

export const addReplyToComment = async (
  postId: string,
  commentId: string,
  comment: string,
  userId: string,
  username: string,
  userImg: any
) => {
  const docRef = await addDoc(
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
  const newReply = await getDoc(docRef);
  const id = newReply.id;
  const data = newReply.data() as Omit<IReplyComment, "id">;
  const timestamp = newReply.data()?.timestamp.toDate();
  return { id, ...data, timestamp };
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
  const docRef = doc(db, "posts", postId, "comments", commentId);
  await updateDoc(docRef, {
    comment: text,
  });
  const newComment = await getDoc(docRef);
  const id = newComment.id;
  const data = newComment.data() as Omit<IComment, "id">;
  const timestamp = newComment.data()?.timestamp.toDate();
  return { id, ...data, timestamp };
};
