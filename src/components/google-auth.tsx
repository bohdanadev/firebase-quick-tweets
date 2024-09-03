import React, { FC, MouseEvent } from "react";
import { signInWithGoogle } from "@/lib/firebase/auth";
import google from "@/assets/google.jpg";
import Image from "next/image";

export const GoogleAuth: FC = () => {
  const handleSignIn = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signInWithGoogle();
  };

  return (
    <button
      className="btn btn-wide flex flex-row bg-black hover:bg-black hover:font-bold text-slate-200  py-1 px-4 rounded border-2 border-neutral mt-0.5"
      onClick={handleSignIn}
    >
      <Image src={google} alt="google logo icon" width={30} height={30} />
      {"Sign in with Google"}
    </button>
  );
};

export default GoogleAuth;
