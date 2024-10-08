import { app, auth, db, storage } from "@/lib/firebase/firebase";
import { IUser } from "@/types";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  deleteField,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { deleteImageInStorage } from "./storage";

export const createUser = async (
  username: string,
  selectedFile: any,
  email: string,
  password: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  if (user && selectedFile) {
    const profilePhotoRef = ref(
      storage,
      `profilePhotos/${user.uid}/profilePhoto`
    );
    await uploadString(profilePhotoRef, selectedFile, "data_url").then(
      async () => {
        const thumbPhotoRef = ref(
          storage,
          //`profilePhotos/${user.uid}/thumb_profilePhoto`
          `profilePhotos/${user.uid}/profilePhoto`
        );
        const avatarUrl = await getDownloadURL(thumbPhotoRef);
        if (avatarUrl) {
          const docRef = doc(db, "users", user.uid);
          await setDoc(docRef, {
            username,
            profilePhoto: avatarUrl,
            email: email,
            status: "online",
          });
        }
      }
    );
  }
  // await sendEmailVerification(user);
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

export const updateMyProfile = async (
  id: string,
  updatedFields: { username?: string; profilePhoto?: string | null }
  // updatedFields: { username?: string}
) => {
  const userRef = doc(db, "users", id);
  if (!updatedFields.profilePhoto) {
    await updateDoc(userRef, {
      username: updatedFields.username,
      profilePhoto: deleteField(),
    });
  } else {
    await updateDoc(userRef, updatedFields);
  }
  const user = auth.currentUser;
  if (user) {
    await updateProfile(user, {
      displayName: updatedFields.username,
      // photoURL: updatedFields.profilePhoto ? updatedFields.profilePhoto : "",
      photoURL: updatedFields.profilePhoto,
    })
      .then(() => {
        console.log("Profile updated");
      })
      .catch((error) => {
        console.log("Failed to update profile", error);
      });
  }
};

export const deleteAccount = async (user: IUser) => {
  try {
    await auth.currentUser?.delete();
  } catch (error) {
    console.error("Failed delete user");
  }
  try {
    await deleteDoc(doc(db, "users", user.id));
  } catch (error) {
    console.error("Failed delete userProfile");
  }
  if (user.profilePhoto) {
    await deleteImageInStorage(user.profilePhoto);
  }
};
