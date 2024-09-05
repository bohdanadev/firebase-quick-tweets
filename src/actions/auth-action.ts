"use server";

import { createUser } from "@/lib/firebase/user";
import { redirect } from "next/navigation";

export const signupUser = async (
  username: string,
  selectedFile: any,
  email: string,
  password: string
) => {
  try {
    await createUser(username, selectedFile, email, password);
  } catch (error) {
    console.error("Error registering user:", error);
  }
};
