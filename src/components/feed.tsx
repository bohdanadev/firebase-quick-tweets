"use client";
import { DivideIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { FC, useEffect, useState } from "react";
import PostInput from "./post-input";
import { getPosts } from "@/lib/firebase/post";
import { IComment, IPost, IUser } from "@/types";
import PostsSection from "./posts-section";
import { useAuth } from "@/context/auth-context";

const Feed: FC = () => {
  const [initialPosts, setInitialPosts] = useState<IPost[]>([]);
  const [comments, setComments] = useState<IComment[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const paginatedPosts: IPost[] = await getPosts(1);
        console.log("PAGINAT", paginatedPosts);
        setInitialPosts(paginatedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
      <div className="text-[#d9d9d9] flex items-center sm:justify-between py-2 px-3 sticky top-0 z-50 bg-black border-b border-gray-700">
        <h2 className="text-lg sm:text-xl font-bold">Home</h2>
        <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0 ml-auto">
          <SparklesIcon className="h-5 text-white" />
        </div>
      </div>
      <PostInput />
      <div className="pb-72">
        <PostsSection initialPosts={initialPosts} userId="" />
      </div>
    </div>
  );
};

export default Feed;
