"use server";
import { redirect } from "next/navigation";

export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  let errors = {};

  if (!email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }

  if (password.trim().length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }
  return { message: "Signup", errors: null };
}

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  redirect("/posts");
}

export async function auth(mode, prevState, formData) {
  if (mode === "login") {
    return await login(prevState, formData);
  }
  return await signup(prevState, formData);
}

export async function logout() {
  redirect("/");
}
