"use client";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "./firebase/user";
import { IUser } from "@/types";
import { app } from "./firebase/firebase";

export const useUser = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userData = await getUser(currentUser.uid);
        if (userData) {
          setUser(userData);
        }
      } else {
        setUser(null);
        router.push("/?mode=login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth, router]);

  return { user, loading };
};
