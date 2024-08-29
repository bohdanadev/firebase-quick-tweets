"use client";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { FC, Suspense, useEffect, useState } from "react";
import PostInput from "./post-input";
import { getPosts } from "@/lib/firebase/post";
import { IPost } from "@/types";
import PostsSection from "./posts-section";
import { useUser } from "@/lib/getUser";
import DataLoading from "@/app/loading";
import Search from "./search";

const Feed: FC = () => {
  const [initialPosts, setInitialPosts] = useState<IPost[] | null>(null);
  const [lastDocId, setLastDocId] = useState<string | null>(null);
  const [showMyPosts, setShowMyPosts] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>();
  const { user: currentUser } = useUser();

  useEffect(() => {
    const fetchPosts = async () => {
      const pageSize = 4;
      if (currentUser) {
        try {
          const { posts, lastVisibleId } = showMyPosts
            ? await getPosts(pageSize, undefined, currentUser.uid)
            : await getPosts(pageSize);
          setInitialPosts([...posts]);
          setLastDocId(lastVisibleId);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      }
    };

    fetchPosts();
  }, [showMyPosts, currentUser]);

  const handleCheck = () => {
    setShowMyPosts((prev) => !prev);
  };

  const handleSearch = async (searchTerm: string) => {
    const filteredPosts = await getPosts(10, undefined, undefined, {
      text: searchTerm,
    });
    setInitialPosts([...filteredPosts.posts]);
  };

  console.log("INITIAAL", initialPosts);

  return (
    <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
      <div className="sticky top-0 z-50 bg-black border-b border-gray-700">
        <div className="text-[#d9d9d9] flex items-center sm:justify-between py-2 px-3">
          <Search handleSearch={handleSearch} />
          <div className="form-control mx-10">
            <label className="cursor-pointer label">
              <span className="label-text font-m text-neutral-100">
                My posts
              </span>
              <input
                type="checkbox"
                onChange={handleCheck}
                className="checkbox checkbox-accent ml-2"
              />
            </label>
          </div>
          <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0 ml-auto">
            <SparklesIcon className="h-5 text-white" />
          </div>
        </div>
        <PostInput currentUser={currentUser} />
      </div>

      <div className="overflow-y-auto h-[calc(100vh-150px)]">
        {" "}
        {initialPosts && (
          <Suspense fallback={<DataLoading />}>
            <PostsSection
              initialPosts={initialPosts}
              lastVisible={lastDocId}
              text={searchText}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default Feed;
