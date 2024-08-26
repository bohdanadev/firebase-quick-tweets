import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  getAuth,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInAnonymously,
} from "firebase/auth";
import { auth } from "./firebase";

export function onAuthStateChanged(cb) {
  return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

export async function signOut() {
  try {
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}

export const forgotPassword = async (email: string) => {
  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log("Password reset email sent!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

export const changePassword = async (newPassword: string) => {
  const auth = getAuth();

  const user = auth.currentUser;
  if (user) {
    await updatePassword(user, newPassword)
      .then(() => {
        console.log(" Update successful.");
        signOut();
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export const reauth = async (password: string) => {
  const auth = getAuth();

  const user = auth.currentUser;
  if (user) {
    const credential = EmailAuthProvider.credential(user.email!, password);
    await reauthenticateWithCredential(user, credential);
  }
};
