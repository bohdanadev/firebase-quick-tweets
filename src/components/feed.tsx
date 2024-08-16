"use client";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Post from "./post";
import { FC, useEffect, useState } from "react";
import { onSnapshot, collection, query, orderBy } from "@firebase/firestore";
import { db } from "../firebase";
import PostInput from "./post-input";

interface IProps {
  currentUser: IUser;
}

const Feed: FC<IProps> = ({ currentUser }) => {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      ),
    [db]
  );

  return (
    <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
      <div className="text-[#d9d9d9] flex items-center sm:justify-between py-2 px-3 sticky top-0 z-50 bg-black border-b border-gray-700">
        <h2 className="text-lg sm:text-xl font-bold">Home</h2>
        <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0 ml-auto">
          <SparklesIcon className="h-5 text-white" />
        </div>
      </div>
      <PostInput currentUser={currentUser} />
      <div className="pb-72">
        {posts.map((post) => (
          <Post key={post.id} id={post.id} post={post} postPage={"1"} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
