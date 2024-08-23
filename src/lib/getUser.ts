"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase/firebase";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  return user;
};
