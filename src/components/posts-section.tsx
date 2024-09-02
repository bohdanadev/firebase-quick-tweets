"use client";

import { FC, useEffect, useState } from "react";
import Post from "@/components/post";
import { getPosts } from "@/lib/firebase/post";
import { IPost } from "@/types";
import DataLoading from "@/app/loading";
import { useUser } from "@/lib/getUser";

interface IProps {
  initialPosts: IPost[];
  lastVisible: string;
  userId?: string;
  text?: string;
  showMyPosts?: boolean;
}

const PostsSection: FC<IProps> = ({
  initialPosts,
  lastVisible,
  userId,
  text,
  showMyPosts,
}) => {
  const [posts, setPosts] = useState<IPost[]>(initialPosts);
  const [lastDoc, setLastDoc] = useState<string>(lastVisible);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { user } = useUser();

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const loadPosts = async () => {
    setLoading(true);

    const pageSize = 4;
    if (lastDoc) {
      let results;
      if (userId || showMyPosts) {
        const userIdForFetch = showMyPosts ? user?.id : userId;
        results = text
          ? await getPosts(pageSize, lastDoc, userIdForFetch, { text })
          : await getPosts(pageSize, lastDoc, userIdForFetch);
      } else {
        results = text
          ? await getPosts(pageSize, lastDoc, undefined, { text })
          : await getPosts(pageSize, lastDoc);
      }
      setPosts((prevPosts) => [...prevPosts, ...results.posts]);
      setLastDoc(results.lastVisibleId);
      if (results.posts.length < pageSize) {
        setHasMore(false);
      }
    }
    setLoading(false);
  };

  return (
    <div className="mt-4 pb-72 h-full scroll-smooth scroll-ml-0">
      {posts &&
        posts.map((post) => <Post key={post.id} id={post.id} post={post} />)}
      {loading && <DataLoading />}
      {!loading && posts.length > 0 && hasMore ? (
        <button
          className="btn btn-active btn-neutral w-full mx-auto bg-black mt-4 border-none"
          onClick={loadPosts}
        >
          Load more
        </button>
      ) : (
        <p className="text-center mt-4 text-lg text-gray-200">No more posts</p>
      )}
    </div>
  );
};

export default PostsSection;
