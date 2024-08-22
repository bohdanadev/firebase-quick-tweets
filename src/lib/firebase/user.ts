import { app, db } from "@/lib/firebase/firebase";
import { IUser } from "@/types";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
  signOut,
  getAuth,
} from "firebase/auth";

import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

export const createUser = async (
  username: string,
  email: string,
  password: string,
  avatarUrl: string
) => {
  const auth = getAuth();
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  const docRef = doc(db, "users", user.uid);
  return await setDoc(docRef, {
    username,
    email: email,
    avatarUrl,
    status: "online",
  });
};

export const signin = async (email: string, password: string) => {
  const auth = getAuth(app);
  // const userCredential = await signInWithEmailAndPassword(
  //   auth,
  //   email,
  //   password
  // );
  // const user = userCredential.user;
  // return user;
  await signInWithEmailAndPassword(auth, email, password);
};

export const signout = async () => {
  const auth = getAuth();
  await signOut(auth);
};

export const getUser = async (uid: string) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const id = docSnap.id;
    const data = docSnap.data() as Omit<IUser, "id">;
    return { id, ...data };
  } else {
    throw new Error("Document not found");
  }
};

const updateProfile = async (id: string, data: IUser) => {
  const userRef = doc(db, "users", id);

  return await updateDoc(userRef, {
    username: data.username,
  });
};

export const deleteAccount = async (id: string) => {
  await deleteDoc(doc(db, "users", id));
};
