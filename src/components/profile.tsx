import { FC, useEffect, useState } from "react";
import { getUser } from "@/lib/firebase/user";
import { IUser } from "@/types";
import Image from "next/image";
import avatar from "@/assets/avatar.jpg";

interface IProps {
  userId: string;
}

const Profile: FC<IProps> = async ({ userId }) => {
  //const [user, setUser]= useState<IUser | null>(null)
  //    useEffect(()=> {
  //        const fetchUser
  //setUser(getUser(id));
  //
  //    }, [userId])

  const user = await getUser(userId);
  return (
    <div className="card w-full bg-base-200 shadow-xl p-4">
      <div className="flex items-center">
        <div className="avatar">
          <div className="w-24 rounded-full">
            <Image
              src={user.profilePhoto ?? avatar}
              width={24}
              height={24}
              alt="User Avatar"
            />
          </div>
        </div>
        <div className="ml-4 flex flex-col gap-2">
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <div className="flex flex-row">
            <button className="btn btn-wide">Edit Profile</button>
            <button className="btn btn-wide">Change Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
