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
  searchParams?: Record<string, string> | null | undefined;
}

const Profile: FC<IProps> = ({ userId, searchParams }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const { user: currentUser } = useUser();

  const show = searchParams?.show;
  const target = searchParams?.target;

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser(userId);
      setUser(userData);
    };
    fetchUser();
  }, [userId]);

  const userPhoto = user?.profilePhoto ?? avatar;
  return (
    <div className="card w-full bg-base-200 shadow-xl p-4">
      <div className="flex items-center">
        <div className="avatar">
          <div className="w-24 rounded-full">
            <Image
              src={currentUser?.photoURL ?? userPhoto}
              width={24}
              height={24}
              alt="User Avatar"
            />
          </div>
        </div>
        <div className="ml-4 flex flex-col gap-2">
          <h2 className="text-2xl font-bold">
            {currentUser?.displayName ?? user?.username}
          </h2>
          <div className="flex flex-row">
            <Link href={`/users/${userId}?show=true&target=profile`}>
              <div className="btn btn-wide">Edit Profile</div>
            </Link>
            <Link href={`/users/change-password`}>
              <div className="btn btn-wide">Change Password</div>
            </Link>
          </div>
        </div>
      </div>
      {show && <Modal isOpen={true} target={target} user={user} />}
    </div>
  );
};

export default Profile;
