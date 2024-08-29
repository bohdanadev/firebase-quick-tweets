import React, { useState, useEffect, FC } from "react";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { IUser } from "@/types";
import { User } from "firebase/auth";
import google from "@/assets/google.jpg";
import Image from "next/image";

interface IProps {
  initialUser: IUser | User | null;
}

// //function useUserSession(initialUser) {
//  The initialUser comes from the server via a server component
//  // const [user, setUser] = useState<User | null>(initialUser);
//  // const router = useRouter();
// //
//  Register the service worker that sends auth state back to server
//  The service worker is built with npm run build-service-worker
//  // useEffect(() => {
//    // if ("serviceWorker" in navigator) {
//      // const serializedFirebaseConfig = encodeURIComponent(
//        // JSON.stringify(firebaseConfig)
//      // );
//      // const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`;
// //
//      // navigator.serviceWorker
//        // .register(serviceWorkerUrl)
//        // .then((registration) => console.log("scope is: ", registration.scope));
//    // }
//  // }, []);
// //
//  // useEffect(() => {
//    // const unsubscribe = onAuthStateChanged(auth, (authUser) => {
//      // setUser(authUser);
//    // });
// //
//    // return () => unsubscribe();
//  // }, []);
// //
//  // useEffect(() => {
//    // onAuthStateChanged(auth, (authUser) => {
//      // if (user === undefined) return;
// //
//      refresh when user changed to ease testing
//      // if (user?.email !== authUser?.email) {
//        // router.refresh();
//      // }
//    // });
//  // }, [user]);
// //
//  // return user;
// //}

export const GoogleAuth: FC<IProps> = ({ initialUser }) => {
  // const user = useUserSession(initialUser);

  const handleSignIn = (e) => {
    e.preventDefault();
    signInWithGoogle();
  };

  return (
    <button
      className="btn btn-wide flex flex-row bg-black hover:bg-black hover:font-bold text-slate-200  py-1 px-4 rounded border-2 border-neutral mt-0.5"
      onClick={handleSignIn}
    >
      <Image src={google} alt="google logo icon" width={30} height={30} />
      {"Sign in with Google"}
    </button>
  );
};

export default GoogleAuth;
