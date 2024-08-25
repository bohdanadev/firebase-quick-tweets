"use client";

import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useUser = () => {
  const auth = getAuth();
  const [user, setUser] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        router.push("/?mode=login");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  return user;
};
