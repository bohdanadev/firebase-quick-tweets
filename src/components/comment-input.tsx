"use-client";
import { FC, FormEvent, Fragment, useEffect, useState } from "react";
import {
  CalendarIcon,
  ChartBarIcon,
  FaceSmileIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { IPost, IUser } from "@/types";
import { User } from "firebase/auth";

import { getUser } from "@/lib/firebase/user";
import { createComment } from "@/actions/post-action";

interface IProps {
  post: IPost;
  user: User;
}

const CommentInput: FC<IProps> = ({ post, user }) => {
  const [comment, setComment] = useState<string>("");
  const [userData, setUserData] = useState<IUser | null>(null);

  useEffect(() => {
    if (user) {
      const fetchUser = async () => {
        const response = await getUser(user.uid);
        if (response) {
          setUserData(response);
        } else {
          setUserData(null);
        }
      };
      fetchUser();
    }
  }, [user]);

  const name = user?.displayName ?? userData?.username!;
  const image = user?.photoURL ?? (userData?.profilePhoto || null);

  return (
    <div>
      <div className="mt-7 flex space-x-3 w-full">
        <img
          src={user?.photoURL ?? userData?.profilePhoto}
          alt=""
          className="h-11 w-11 rounded-full"
        />
      </div>
      <div className="flex-grow mt-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tweet your reply"
          rows={2}
          className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[80px]"
        />
      </div>

      <div className="flex items-center justify-between pt-2.5">
        <div className="flex items-center">
          <div className="icon">
            <PhotoIcon className="text-[#1d9bf0] h-[22px]" />
          </div>

          <div className="icon rotate-90">
            <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
          </div>

          <div className="icon">
            <FaceSmileIcon className="text-[#1d9bf0] h-[22px]" />
          </div>

          <div className="icon">
            <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
          </div>
        </div>
        <button
          className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
          type="button"
          onClick={() =>
            createComment(post.id, comment, user?.uid, name, image)
          }
          disabled={!comment.trim()}
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
