import { app, auth, db, storage } from "@/lib/firebase/firebase";
import { IFormUserProfileData, IUser } from "@/types";
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
  FieldValue,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";

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
  // sendEmailVerification(user);
  if (selectedFile) {
    const profilePhotoRef = ref(
      storage,
      `profilePhotos/${user.uid}/profilePhoto`
    );
    await uploadString(profilePhotoRef, selectedFile, "data_url").then(
      async () => {
        const thumbPhotoRef = ref(
          storage,
          `profilePhotos/${user.uid}/thumb_profilePhoto`
        );
        const avatarUrl = await getDownloadURL(thumbPhotoRef);
        const docRef = doc(db, "users", user.uid);
        return await setDoc(docRef, {
          username,
          profilePhoto: avatarUrl,
          email: email,
          status: "online",
        });
      }
    );
  }
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
  data: IFormUserProfileData,
  currentProfilePhoto?: string
) => {
  const userRef = doc(db, "users", id);
  let updatedFields: {
    username?: string;
    profilePhoto?: string | null | FieldValue;
  } = {};

  if (data.username) {
    updatedFields.username = data.username;
  }

  if (data.image && data.image.length > 0) {
    const imageFile = data.image[0];
    const imageRef = ref(storage, `profilePhotos/${id}/$profilePhoto`);
    await uploadBytes(imageRef, imageFile);
    const thumbRef = ref(storage, `profilePhotos/${id}/thumb_profilePhoto`);
    const imageUrl = await getDownloadURL(thumbRef);
    updatedFields.profilePhoto = imageUrl;
  }

  if (currentProfilePhoto && data.image) {
    const imageRef = ref(storage, currentProfilePhoto);
    await deleteObject(imageRef);
    //  updatedFields.profilePhoto = deleteField();
  }

  await updateDoc(userRef, updatedFields);

  await updateProfile(auth.currentUser!, {
    displayName: updatedFields.username,
    photoURL: updatedFields.profilePhoto,
  })
    .then(() => {
      console.log("Profile updated");
    })
    .catch((error) => {
      console.log("Failed to update profile");
    });
};

export const deleteAccount = async (id: string) => {
  await auth.currentUser?.delete();
  await deleteDoc(doc(db, "users", id));
};
