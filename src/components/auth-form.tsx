"use client";
import { FC, FormEvent, useEffect, useState } from "react";
import { auth, login } from "@/actions/auth-action";
import Link from "next/link";
import { useFormState } from "react-dom";
import Image from "next/image";
import logo from "@/assets/logo.png";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { getUser, signin } from "@/lib/firebase/user";
import { app } from "@/lib/firebase/firebase";

interface IProps {
  mode: string;
}

const AuthForm: FC<IProps> = ({ mode }) => {
  // const [formState, formAction, isPending] = useFormState(
  //   auth.bind(null, mode),
  //   {
  //     errors: {},
  //   }
  // );
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  //const { setAuthUserContext, setAuthContextNull } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  // const auth = getAuth(app);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       const userFromDB = await getUser(user);
  //       console.log("UserDB", userFromDB);
  //
  //       setAuthUserContext(userFromDB);
  //     } else {
  //       setAuthContextNull();
  //       router.push("/?mode=login");
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [auth, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    //try {
    //  const { error } = baseSchema.validate(
    //    { email, password },
    //    { abortEarly: false }
    //  );
    //  if (error) {
    //    const errorObj: Record<string, string> = {};
    //    error.details.forEach((detail) => {
    //      errorObj[detail.path[0]] = detail.message;
    //    });
    //    setErrors(errorObj);
    //  } else {
    await signin(email, password);

    //  setAuthUserContext(signedUser);
    router.push("/posts");

    //    setErrors({});
    ///    }
    ///  } catch (error) {
    ///    toast.error(error.message);
    ///    setErrors({});
    ///  }
    setLoading(false);
  };

  return (
    // <div className="max-w-md max-h-md mx-auto">
    <div className="bg-black min-h-screen flex max-w-md mx-auto flex-col items-center justify-center">
      <div className="card bg-base-100 rounded-box grid h-10 place-items-center">
        content
      </div>
      <div className="divider divider-accent text-slate-400">OR</div>
      <form
        onSubmit={handleSubmit}
        //  action={formAction}
        className="bg-stone-100 shadow-md w-full rounded px-8 pt-6 pb-8 mb-4 flex flex-col items-center justify-between gap-5"
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
              name="username"
              id="username"
              required
            />
          </label>
        )}
        {mode === "signup" && (
          <input
            type="file"
            className="file-input file-input-bordered file-input-sm w-full max-w-xs"
            name="profilePic"
            id="profilePic"
          />
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
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
              name="confirmPassword"
              id="confirmPassword"
              required
            />
          </label>
        )}

        {/* {formState?.errors && ( 
           <ul id="form-errors">
             {Object.keys(formState?.errors).map((error) => (
               <li className="text-error" key={error}> 
                 {formState?.errors[error]}
               </li>
              ))} 
           </ul>
          )} */}

        <div className="flex items-center justify-between">
          {/* {isPending && (
            <button className="btn btn-square">
              <span className="loading loading-spinner"></span>
            </button>
          )} */}

          <button
            type="submit"
            className="btn btn-wide w-full text-lg bg-teal-300"
          >
            {mode === "signup" ? "Sign Up" : "Sign In"}
          </button>
        </div>
        <div>
          {mode === "login" && (
            <p className="text-sm text-gray-700">
              <Link
                href="/?mode=signup"
                className="btn btn-active btn-link text-md p-1 m-0"
              >
                Create
              </Link>
              an account.
            </p>
          )}
          {mode === "signup" && (
            <p className="text-sm text-gray-700">
              <Link
                href="/?mode=login"
                className="btn btn-active btn-link text-md p-1 m-0"
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
