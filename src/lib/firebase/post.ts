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
  deleteField,
  increment,
} from "firebase/firestore";

import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "@firebase/storage";
import { db, storage } from "./firebase";

type FiltersType = {
  text?: string;
  username?: string;
};

function applyQueryFilters(q: any, { text, username }: FiltersType) {
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
  lastDoc?: string,
  userId?: string,
  filters?: { text?: string; username?: string }
) => {
  let q;
  let lastDocSnap;
  if (lastDoc) {
    const docRef = doc(db, "posts", lastDoc);
    lastDocSnap = await getDoc(docRef);
  }
  if (lastDoc) {
    q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(pageSize),
      startAfter(lastDocSnap)
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
          startAfter(lastDocSnap)
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

  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

  const lastVisibleId = lastVisible?.id;

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
  return { posts, lastVisibleId };
};

export const addPost = async (
  userId: string,
  username: string,
  profilePhoto: string,
  input: string,
  selectedFile: any
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
      const downloadURL = await getDownloadURL(
        imageRef
        //  ref(storage, `posts/${docRef.id}/thumb_image`)
      );
      await updateDoc(doc(db, "posts", docRef.id), {
        image: downloadURL,
      });
    });
  }
  // const docSnap = await getDoc(docRef);
  // if (docSnap.exists()) {
  //   const id = docSnap.id;
  //   const data = docSnap.data() as Omit<IPost, "id">;
  //   const timestamp = docSnap.data().timestamp.toDate();
  //
  //   return { id, ...data, timestamp };
  // }
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

export const updatePost = async (
  postId: string,
  updatedFields: { text?: string; image?: string | null }
) => {
  const postRef = doc(db, "posts", postId);
  if (updatedFields.image === null) {
    return await updateDoc(postRef, {
      image: deleteField(),
      text: updatedFields.text,
    });
  } else {
    return await updateDoc(postRef, updatedFields);
  }
};

export const deletePostWithComments = async (postId: string) => {
  const q = query(collection(db, "posts", postId, "comments"));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    querySnapshot.forEach(async (comment) => {
      const qR = query(
        collection(db, "posts", postId, "comments", comment.id, "replies")
      );
      const replyQuerySnapshot = await getDocs(qR);
      if (!replyQuerySnapshot.empty) {
        replyQuerySnapshot.forEach(async (reply) => {
          await deleteDoc(
            doc(
              db,
              "posts",
              postId,
              "comments",
              comment.id,
              "replies",
              reply.id
            )
          );
        });
      }
      await deleteDoc(doc(db, "posts", postId, "comments", comment.id));
    });
  }
  await deleteDoc(doc(db, "posts", postId));
  const imageRef = ref(storage, `posts/${postId}/image`);
  //  const imageThumbRef = ref(storage, `posts/${postId}/thumb_image`);
  await deleteObject(imageRef);
  //  await deleteObject(imageThumbRef);
};

export const likePost = async (postId: string, userId: string) => {
  try {
    const postRef = doc(db, "posts", postId);

    return await updateDoc(postRef, {
      likes: arrayUnion(userId),
      likesCount: increment(1),
    });
  } catch (error) {
    console.error("Error liking post: ", error);
  }
};

export const unlikePost = async (postId: string, userId: string) => {
  const postRef = doc(db, "posts", postId);
  return await updateDoc(postRef, {
    likes: arrayRemove(userId),
    likesCount: increment(-1),
  });
};
