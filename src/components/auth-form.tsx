"use client";
import { FC, FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { useRouter } from "next/navigation";
import GoogleAuth from "./google-auth";
import { useUser } from "@/lib/getUser";
import { SubmitHandler, useForm } from "react-hook-form";
import { IAuth } from "@/types";
import { joiResolver } from "@hookform/resolvers/joi";
import {
  baseSchema,
  signupSchema,
} from "@/lib/validators/auth-form.validation";
import { createUser, signin } from "@/lib/firebase/user";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface IProps {
  mode: string;
}

const AuthForm: FC<IProps> = ({ mode }) => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  let {
    formState: { errors, isValid },
    register,
    handleSubmit,
  } = useForm<IAuth>({
    mode: "all",
    resolver: joiResolver(mode === "signup" ? signupSchema : baseSchema),
  });

  const router = useRouter();

  const { user: currentUser } = useUser();

  const addAvatar = (e: any) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
      setSelectedFile(reader.result);
    };
  };

  const authLoginHandler: SubmitHandler<IAuth> = async (data) => {
    await signin(data.email!, data.password!);
    router.push("/posts");
  };
  const authSignupHandler: SubmitHandler<IAuth> = async (data) => {
    try {
      await createUser(data.username, selectedFile, data.email, data.password);
      router.push("/?mode=login");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="bg-black min-h-screen flex max-w-md mx-auto flex-col items-center justify-center">
      <GoogleAuth />

      <div className="divider divider-accent text-slate-400 my-2.5">OR</div>
      <form
        onSubmit={handleSubmit(
          mode === "login" ? authLoginHandler : authSignupHandler
        )}
        className="bg-stone-100 shadow-md w-full rounded px-8 pt-6 pb-2 mb-4 flex flex-col items-center justify-between gap-5"
      >
        <Image src={logo} alt="logo" width={30} height={30} priority />
        {mode === "signup" ? (
          <h4 className="font-bold text-xl px-4">Create your account</h4>
        ) : (
          <h4 className="font-bold text-xl px-4">
            Sign in to{" "}
            <span className="text text-teal-400 font-bold">QuickTweets</span>
          </h4>
        )}

        {errors.username && (
          <div className="text-error">{errors.username?.message}</div>
        )}
        {errors.email && (
          <div className="text-error"> {errors.email?.message}</div>
        )}
        {errors.password && (
          <div className="text-error">{errors.password?.message}</div>
        )}
        {errors.confirmPassword && (
          <div className="text-error">{errors.confirmPassword?.message}</div>
        )}
        {mode === "signup" && (
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Username"
              {...register("username")}
              id="username"
              required
            />
          </label>
        )}

        {mode === "signup" && (
          <>
            <label
              htmlFor="profilePhoto"
              className="flex gap-4 items-center text-light-1 cursor-pointer"
            >
              <p>Upload a photo</p>
              {selectedFile && (
                <div className="relative">
                  <div
                    className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                    onClick={() => setSelectedFile(null)}
                  >
                    <XMarkIcon className="text-white h-5" />
                  </div>
                  <Image
                    src={selectedFile}
                    alt=""
                    className="rounded-2xl max-h-80 object-contain"
                  />
                </div>
              )}
            </label>
            <input
              type="file"
              className="file-input file-input-bordered file-input-xs w-full max-w-xs"
              id="profilePhoto"
              {...register("profilePhoto")}
              onChange={addAvatar}
            />
          </>
        )}

        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Email"
            {...register("email")}
            id="email"
            required
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            className="grow"
            placeholder="password"
            {...register("password")}
            id="password"
            required
          />
        </label>

        {mode === "signup" && (
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              className="grow"
              placeholder="confirmPassword"
              {...register("confirmPassword")}
              id="confirmPassword"
              required
            />
          </label>
        )}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="btn btn-wide w-full text-lg bg-teal-300"
          >
            {mode === "signup" ? "Sign Up" : "Sign In"}
          </button>
        </div>
        <div>
          {mode === "login" && (
            <>
              <div className="mt-4 text-center">
                <Link
                  href="/forgot-password"
                  className="text-blue-500 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <p className="text-sm text-gray-700">
                <Link
                  href="/?mode=signup"
                  className="btn btn-active btn-link text-md p-1 m-0"
                >
                  Create
                </Link>
                an account.
              </p>
            </>
          )}
          {mode === "signup" && (
            <p className="text-sm text-gray-700 h-8 mb-3">
              <Link
                href="/?mode=login"
                className="btn btn-active btn-link text-md p-1 m-0 h-8"
              >
                Login
              </Link>
              with existing account.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
