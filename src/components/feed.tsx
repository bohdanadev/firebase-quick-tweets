"use client";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { FC, Suspense, useEffect, useState } from "react";
import PostInput from "./post-input";
import { getPosts } from "@/lib/firebase/post";
import { IPost } from "@/types";
import PostsSection from "./posts-section";
import { useUser } from "@/lib/getUser";
import { DocumentData } from "firebase/firestore";
import DataLoading from "@/app/loading";

const Feed: FC = () => {
  const [initialPosts, setInitialPosts] = useState<IPost[] | null>(null);
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);
  const { user: currentUser } = useUser();

  useEffect(() => {
    const fetchPosts = async () => {
      const pageSize = 3;
      try {
        const { posts, lastVisible } = await getPosts(pageSize);
        setInitialPosts(posts);
        setLastDoc(lastVisible);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  console.log("INITIAL", initialPosts);

  return (
    <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
      <div className="text-[#d9d9d9] flex items-center sm:justify-between py-2 px-3 sticky top-0 z-50 bg-black border-b border-gray-700">
        <h2 className="text-lg sm:text-xl font-bold">Quick-Tweets</h2>
        <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0 ml-auto">
          <SparklesIcon className="h-5 text-white" />
        </div>
      </div>
      <PostInput currentUser={currentUser} />
      {initialPosts && (
        <Suspense fallback={<DataLoading />}>
          <PostsSection initialPosts={initialPosts} lastVisible={lastDoc} />
        </Suspense>
      )}
    </div>
  );
};

export default Feed;
