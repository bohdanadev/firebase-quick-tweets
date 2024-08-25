import { app, auth, db, storage } from "@/lib/firebase/firebase";
import { IUser } from "@/types";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
  signOut,
  getAuth,
} from "firebase/auth";

import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const createUser = async (
  username: string,
  profilePhoto: any,
  email: string,
  password: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  let avatarUrl = null;
  if (profilePhoto) {
    const profilePhotoRef = ref(storage, `profilePhotos/${user.uid}`);
    await uploadBytes(profilePhotoRef, profilePhoto);
    avatarUrl = await getDownloadURL(profilePhotoRef);
  }

  const docRef = doc(db, "users", user.uid);
  return await setDoc(docRef, {
    username,
    profilePhoto: avatarUrl,
    email: email,
    status: "online",
  });
};

export const signin = async (email: string, password: string) => {
  const auth = getAuth(app);
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
  const auth = getAuth();
  updateProfile(auth.currentUser, {
    displayName: data.username,
    photoURL: data.profilePhoto,
  })
    .then(() => {
      // Profile updated!
      // ...
    })
    .catch((error) => {
      // An error occurred
      // ...
    });

  const userRef = doc(db, "users", id);

  return await updateDoc(userRef, {
    // username: data.username,
    ...data,
  });
};

export const deleteAccount = async (id: string) => {
  const auth = getAuth();
  await auth.currentUser?.delete();
  await deleteDoc(doc(db, "users", id));
};
