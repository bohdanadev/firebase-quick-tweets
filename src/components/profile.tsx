"use=client";
import { FC } from "react";
import { getUser } from "@/lib/firebase/user";
import Image from "next/image";
import avatar from "@/assets/avatar.jpg";
import Link from "next/link";
import Modal from "./modal";
import { useUser } from "@/lib/getUser";

interface IProps {
  userId: string;
  searchParams?: Record<string, string> | null | undefined;
}

const Profile: FC<IProps> = async ({ userId, searchParams }) => {
  const currentUser = useUser();
  const user = await getUser(userId);
  const show = searchParams?.show;
  const target = searchParams?.target;

  const userPhoto = user.profilePhoto ?? avatar;
  return (
    <div className="card w-full bg-base-200 shadow-xl p-4">
      <div className="flex items-center">
        <div className="avatar">
          <div className="w-24 rounded-full">
            <Image
              src={currentUser.profilePhoto ?? userPhoto}
              width={24}
              height={24}
              alt="User Avatar"
            />
          </div>
        </div>
        <div className="ml-4 flex flex-col gap-2">
          <h2 className="text-2xl font-bold">
            {currentUser.displayName ?? user.username}
          </h2>
          <div className="flex flex-row">
            <Link href={`/users/${userId}?show=true&target=profile`}>
              <div className="btn btn-wide">Edit Profile</div>
            </Link>
            <Link href={`/users/${userId}?show=true&target=password`}>
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
