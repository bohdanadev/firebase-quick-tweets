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

  const userPhoto = user?.profilePhoto ?? avatar;
  return (
    <div className="card w-full bg-black shadow-xl p-4">
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
    </div>
  );
};

export default Profile;
