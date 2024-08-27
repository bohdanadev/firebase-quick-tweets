"use client";
import { FC, useEffect, useState } from "react";
import { getUser } from "@/lib/firebase/user";
import Image from "next/image";
import avatar from "@/assets/avatar.jpg";
import Link from "next/link";
import Modal from "./modal";
import { useUser } from "@/lib/getUser";
import { IUser } from "@/types";

interface IProps {
  userId: string;
  // searchParams?: Record<string, string> | null | undefined;
}

const Profile: FC<IProps> = ({ userId }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user: currentUser } = useUser();

  // const show = searchParams?.show;
  // const target = searchParams?.target;

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser(userId);
      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, [userId]);

  console.log(currentUser?.uid === userId);

  console.log("CURRENT_USER", currentUser);
  console.log("USER", user);

  const userPhoto = user?.profilePhoto ?? avatar;
  return (
    <div className="hero bg-base-400 min-h-700">
      <div className="hero-content flex-col lg:flex-row-reverse">
        {currentUser?.uid === userId ? (
          <img
            src={currentUser?.photoURL ?? userPhoto}
            className="max-w-sm rounded-lg shadow-2xl"
          />
        ) : (
          <img src={userPhoto} className="max-w-sm rounded-lg shadow-2xl" />
        )}
        <div>
          {currentUser?.uid === userId ? (
            <h1 className="text-3xl font-bold">
              {currentUser?.displayName ?? user?.username}
            </h1>
          ) : (
            <h1 className="text-3xl font-bold">{user?.username}</h1>
          )}

          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          {currentUser?.uid === userId && (
            <div className="flex flex-row gap-5">
              <div className="btn btn-neutral" onClick={() => setIsOpen(true)}>
                Edit Profile
              </div>

              <Link href={`/users/change-password`}>
                <div className="btn btn-neutral">Change Password</div>
              </Link>
              <Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                target="profile"
                user={user}
              />
            </div>
          )}
        </div>
      </div>
    </div>

    /*  <div className="card w-full bg-black shadow-xl p-4">
      <div className="flex items-center">
        <div className="avatar">
          <div className="w-24 rounded-full">
            {currentUser?.uid === userId ? (
              <Image
                src={currentUser?.photoURL ?? userPhoto}
                width={500}
                height={500}
                alt="User Avatar"
              />
            ) : (
              <Image
                src={userPhoto}
                width={500}
                height={500}
                alt="User Avatar"
              />
            )}
          </div>
        </div>
        <div className="ml-4 flex flex-col gap-2">
          <h2 className="text-2xl font-bold">
            {currentUser?.uid === userId
              ? currentUser?.displayName
              : user?.username}
          </h2>
          {currentUser?.uid === userId && (
            <div className="flex flex-row gap-5">
              <div className="btn btn-neutral" onClick={() => setIsOpen(true)}>
                Edit Profile
              </div>

              <Link href={`/users/change-password`}>
                <div className="btn btn-neutral">Change Password</div>
              </Link>
              <Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                target="profile"
                user={user}
              />
            </div>
          )}
        </div>
      </div>
    </div>  */
  );
};

export default Profile;
