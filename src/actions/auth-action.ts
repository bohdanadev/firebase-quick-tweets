"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createUser, signin, signout } from "@/lib/firebase/user";

export async function signup(_prevState: any, formData: any) {
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
  await createUser(username, email, password, avatarUrl);
  revalidatePath("/users"); // Update cached users
  redirect("/?mode=login"); // Navigate to the login page
}

export async function login(prevState: any, formData: any) {
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

  //const auth = getAuth();
  //signInWithEmailAndPassword(auth, email, password)
  //  .then((userCredential) => {
  //    // Signed in
  //    const user = userCredential.user;
  //    if (user) {
  //      console.log(user);
  //      redirect("/posts");
  //    }

  //  })
  //  .catch((error) => {
  //    const errorCode = error.code;
  //    const errorMessage = error.message;
  //  });

  //const user = await signin(email, password);
  //if (user) {
  await signin(email, password);
  // redirect("/posts");
}

export async function auth(mode: string, prevState: any, formData: FormData) {
  if (mode === "login") {
    return await login(prevState, formData);
  }
  return await signup(prevState, formData);
}

export async function logout() {
  await signout()
    .then(() => {
      redirect("/?mode=login");
    })
    .catch((error: unknown) => {
      console.error("Error logging out:", error);
      throw new Error("Error logging out");
    });
}
