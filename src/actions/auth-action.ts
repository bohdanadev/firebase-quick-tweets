"use server";
import { createUser, signin } from "@/lib/user";

export async function signup(prevState, formData) {
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const avatarUrl = formData.get("avatarUrl");

  let errors = {};

  if (!email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }

  if (password.trim().length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }

  if (confirmPassword.trim() !== password.trim()) {
    errors.confirmPassword = "Passwords must match!";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }
  return await createUser(username, email, password, avatarUrl);
}

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const user = await signin(email, password);
  return user;
}

export async function auth(mode, prevState, formData) {
  if (mode === "login") {
    return await login(prevState, formData);
  }
  return await signup(prevState, formData);
}

export async function logout() {}
