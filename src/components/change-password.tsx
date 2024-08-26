"use client";

import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IChangePassword } from "@/types";
import { changePassword, reauth } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/getUser";
import changePasswordSchema from "@/lib/validators/change-password-form.validation";
import { joiResolver } from "@hookform/resolvers/joi";

const ChangePassword: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<IChangePassword>({
    mode: "all",
    resolver: joiResolver(changePasswordSchema),
  });
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { user } = useUser();

  const changePasswordHandler: SubmitHandler<IChangePassword> = async (
    data
  ) => {
    if (!user) {
      setError("User not authenticated.");
      return;
    }
    console.log("CURRENT", data);

    try {
      await reauth(data?.currentPassword);
      await changePassword(data.newPassword);
      setMessage(
        "Password updated successfully. Sign in with your new password."
      );
      reset();
      setTimeout(() => {
        router.push("/?mode=login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update password.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Change Password</h2>
        <form onSubmit={handleSubmit(changePasswordHandler)}>
          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-gray-700 font-bold mb-2"
            >
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("currentPassword", { required: true })}
            />
          </div>
          {errors.currentPassword && (
            <div className="text-error">{errors.currentPassword?.message}</div>
          )}
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-gray-700 font-bold mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("newPassword", { required: true })}
            />
          </div>
          {errors.newPassword && (
            <div className="text-error">{errors.newPassword?.message}</div>
          )}
          <div className="mb-4">
            <label
              htmlFor="confirmNewPassword"
              className="block text-gray-700 font-bold mb-2"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("confirmNewPassword", { required: true })}
            />
          </div>
          {errors.confirmNewPassword && (
            <div className="text-error">
              {errors.confirmNewPassword?.message}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Change Password
          </button>
        </form>
        {message && (
          <p className="mt-4 text-green-500 text-center">{message}</p>
        )}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default ChangePassword;
