import React, { useState, useEffect, FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, firebaseConfig } from "@/lib/firebase/firebase";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
interface IProps {
  initialUser: User | null;
}

function useUserSession(initialUser) {
  // The initialUser comes from the server via a server component
  const [user, setUser] = useState<User | null>(initialUser);
  const router = useRouter();

  // Register the service worker that sends auth state back to server
  // The service worker is built with npm run build-service-worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const serializedFirebaseConfig = encodeURIComponent(
        JSON.stringify(firebaseConfig)
      );
      const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`;

      navigator.serviceWorker
        .register(serviceWorkerUrl)
        .then((registration) => console.log("scope is: ", registration.scope));
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (user === undefined) return;

      // refresh when user changed to ease testing
      if (user?.email !== authUser?.email) {
        router.refresh();
      }
    });
  }, [user]);

  return user;
}

export const GoogleAuth: FC<IProps> = ({ initialUser }) => {
  const user = useUserSession(initialUser);

  const handleSignOut = (e) => {
    e.preventDefault();
    signOut(auth);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    signInWithGoogle();
  };

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={user ? handleSignOut : handleSignIn}
    >
      {user ? "Logout" : "Sign in with Google"}
    </button>
  );
};

export default GoogleAuth;
