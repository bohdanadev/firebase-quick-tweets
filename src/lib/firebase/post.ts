import { IPost } from "@/types";
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  doc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  updateDoc,
  addDoc,
  getDoc,
  where,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";

import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { db, storage } from "./firebase";

type FiltersType = {
  text?: string;
  username?: string;
};

function applyQueryFilters(q, { text, username }: FiltersType) {
  if (text) {
    q = query(q, where("text", "==", text));
  }
  if (username) {
    q = query(q, where("username", "==", username));
  }

  return q;
}

export const getPosts = async (
  pageSize: number,
  lastDoc?: DocumentData,
  userId?: string,
  filters?: { text?: string; username?: string }
) => {
  let q;
  if (lastDoc) {
    q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(pageSize),
      startAfter(lastDoc)
    );
  } else {
    q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(pageSize)
    );
  }

  if (userId) {
    q = lastDoc
      ? query(
          collection(db, "posts"),
          where("userId", "==", userId),
          orderBy("timestamp", "desc"),
          limit(pageSize),
          startAfter(lastDoc)
        )
      : query(
          collection(db, "posts"),
          where("userId", "==", userId),
          orderBy("timestamp", "desc"),
          limit(pageSize)
        );
  }
  if (filters) {
    q = applyQueryFilters(q, filters);
  }
  const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

  console.log("POSTS", querySnapshot);
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

  const posts = querySnapshot.docs.map((doc) => {
    const id = doc.id;
    const data = doc.data() as Omit<IPost, "id">;
    const timestamp = doc.data().timestamp.toDate();
    return {
      id,
      ...data,
      timestamp,
    };
  });
  return { posts, lastVisible };
};

export const addPost = async (
  userId: string,
  username: string,
  profilePhoto: string,
  input: string,
  selectedFile: string | ArrayBuffer | null
) => {
  const docRef = await addDoc(collection(db, "posts"), {
    userId,
    username,
    userImg: profilePhoto,
    text: input,
    timestamp: serverTimestamp(),
    comments: [],
    likes: [],
  });

  const imageRef = ref(storage, `posts/${docRef.id}/image`);

  if (selectedFile) {
    await uploadString(imageRef, selectedFile, "data_url").then(async () => {
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(db, "posts", docRef.id), {
        image: downloadURL,
      });
    });
  }
};

export const getPost = async (postId: string) => {
  const postRef = doc(db, "posts", postId);

  const docSnap = await getDoc(postRef);
  if (docSnap.exists()) {
    const id = docSnap.id;
    const data = docSnap.data() as Omit<IPost, "id">;
    const timestamp = docSnap.data().timestamp.toDate();

    return { id, ...data, timestamp };
  } else {
    throw new Error("Document not found");
  }
};

export const updatePost = async (postId: string, data: IPost) => {
  const postRef = doc(db, "posts", postId);

  return await updateDoc(postRef, {
    username: data.username,
  });
};

export const deletePostWithComments = async (postId: string) => {
  const q = query(collection(db, "posts", postId, "comments"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((comment) => {
    deleteDoc(doc(db, "posts", postId, "comments", comment.id));
  });
  return await deleteDoc(doc(db, "posts", postId));
};

export const likePost = async (postId: string, userId: string) => {
  try {
    const postRef = doc(db, "posts", postId);

    return await updateDoc(postRef, {
      likes: arrayUnion(userId),
    });
  } catch (error) {
    console.error("Error liking post: ", error);
  }
};

export const unlikePost = async (postId: string, userId: string) => {
  const postRef = doc(db, "posts", postId);
  return await updateDoc(postRef, {
    likes: arrayRemove(userId),
  });
};
