"use client";
import { FC, Suspense, useEffect, useState } from "react";
import AuthForm from "@/components/auth-form";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import Feed from "@/components/feed";
import Sidebar from "@/components/sidebar";
import Widgets from "@/components/widgets";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import DataLoading from "./../loading";
import { IUser } from "@/types";
import { useAuth } from "@/context/auth-context";
import { getUser } from "@/lib/firebase/user";
import { app } from "@/lib/firebase/firebase";

const PostsPage: FC = () => {
  const { setAuthUserContext, setAuthContextNull } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  //const [dbUser, setDbUser] = useState<IUser | null>(null);
  const router = useRouter();

  const auth = getAuth(app);
  console.log("Auth", auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const user = await getUser(currentUser.uid);
        // setDbUser(user);
        setAuthUserContext(user);
      } else {
        setAuthContextNull();
        router.push("/?mode=login");
      }
    });
    return () => unsubscribe();
  }, [auth]);
  //console.log(dbUser);

  //if (user === null) return <DataLoading />;

  // const auth = getAuth();
  //
  // useEffect(() => {
  // const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
  // if (currentUser) {
  // const docRef = doc(db, "users", currentUser.uid);
  // const docSnap = await getDoc(docRef);
  // if (docSnap.exists()) {
  // const id = docSnap.id;
  // const data = docSnap.data();
  // const user = { id, ...data } as IUser;
  // const user = (await findUser(currentUser)) as IUser;
  // setAuthUser(user);
  // } else {
  // throw new Error("User not found");
  // }
  // } else {
  // setAuthUser(null);
  // router.push("/?mode=login");
  // }
  // });
  // return () => unsubscribe();
  // }, [auth, router]);

  // if (authUser == null) return <DataLoading />;

  return (
    <div className="">
      <div>
        <h3>Home / QuickTweets</h3>
      </div>

      <div className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar />
        <Feed />
        <Widgets />
        {isOpen && <Modal isOpen={isOpen} setIsOpen={setIsOpen} />}
      </div>
    </div>
  );
};

export default PostsPage;
