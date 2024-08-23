import { FC, useEffect, useState } from "react";
import AuthForm from "@/components/auth-form";
import { getAuthenticatedAppForUser } from "@/lib/firebase/server-app";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase/firebase";
import { getUser } from "@/lib/firebase/user";
import DataLoading from "./loading";
import { useUser } from "@/lib/getUser";

interface IProps {
  searchParams: {
    mode: string;
  };
}

const HomePage: FC<IProps> = async ({ searchParams }) => {
  const formMode = searchParams.mode;
  //  const { currentUser } = await getAuthenticatedAppForUser();
  // const currentUser = useUser();
  // const { user, setAuthUserContext, setAuthContextNull } = useAuth();
  //  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const router = useRouter();

  // const auth = getAuth(app);
  // console.log("Auth", auth);
  //
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
  //     if (currentUser !== null) {
  //       const user = await getUser(currentUser);
  //       setAuthUserContext(user);
  //     } else {
  //       setAuthContextNull();
  //       router.push("/?mode=login");
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [auth, setAuthContextNull, setAuthUserContext, router]);

  // if (user === null) return <DataLoading />;

  if (formMode) return <AuthForm mode={formMode} />;
};

export default HomePage;
