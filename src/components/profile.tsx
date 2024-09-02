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
}

const Profile: FC<IProps> = ({ userId }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user: currentUser } = useUser();

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
    <div className="hero bg-base-400 min-h-700">
      <div className="hero-content flex-col lg:flex-row-reverse">
        {currentUser?.id === userId ? (
          <Image
            src={currentUser?.profilePhoto ?? avatar}
            alt="profile photo"
            width={300}
            height={300}
            className="max-w-sm rounded-lg shadow-2xl"
          />
        ) : (
          <Image
            src={userPhoto}
            alt="profile photo"
            width={300}
            height={300}
            className="max-w-sm rounded-lg shadow-2xl"
          />
        )}
        <div>
          {currentUser?.id === userId ? (
            <h1 className="text-3xl font-bold text-base-200">
              {currentUser?.username}
            </h1>
          ) : (
            <h1 className="text-3xl font-bold text-base-200">
              {user?.username}
            </h1>
          )}

          <p className="py-6 text-base-200">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          {currentUser?.id === userId && (
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
                user={currentUser}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
