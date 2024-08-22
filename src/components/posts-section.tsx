"use client";

import { FC, useState } from "react";
import Post from "@/components/post";
import Pagination from "@/components/pagination";
import { getPosts } from "@/lib/firebase/post";
import { IPost } from "@/types";
import { useAuth } from "@/context/auth-context";

interface IProps {
  initialPosts: IPost[];
  userId: string;
}

const PostsSection: FC<IProps> = ({ initialPosts, userId }) => {
  const [posts, setPosts] = useState<IPost[]>(initialPosts);
  const [lastPageLoaded, setLastPageLoaded] = useState<number>(1);
  const { user } = useAuth();

  const loadPage = async () => {
    const nextPage = lastPageLoaded + 1;
    const newPosts = await getPosts(nextPage, userId);
    setPosts([...posts, ...newPosts]);
    setLastPageLoaded(nextPage);
  };

  return (
    <div className="mt-4">
      {posts.map((post) => (
        <Post key={post.id} id={post.id} post={post} user={user} />
      ))}
      <Pagination onLoadMore={loadPage} />
    </div>
  );
};

export default PostsSection;
