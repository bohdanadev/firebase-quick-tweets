"use client";

import { FC, useState } from "react";
import Post from "@/components/post";
import { getPosts } from "@/lib/firebase/post";
import { IPost } from "@/types";
import { DocumentData } from "firebase/firestore";
import DataLoading from "@/app/loading";

interface IProps {
  initialPosts: IPost[];
  lastVisible: string | null;
  userId?: string;
  text?: string;
}

const PostsSection: FC<IProps> = ({
  initialPosts,
  lastVisible,
  userId,
  text,
}) => {
  const [posts, setPosts] = useState<IPost[]>(initialPosts);
  const [lastDoc, setLastDoc] = useState<DocumentData>(
    lastVisible ? JSON.parse(lastVisible) : null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadPosts = async () => {
    setLoading(true);

    const pageSize = 3;
    let results;
    if (userId) {
      results = text
        ? await getPosts(pageSize, lastDoc, userId, { text })
        : await getPosts(pageSize, lastDoc, userId);
    } else {
      results = text
        ? await getPosts(pageSize, lastDoc, _, { text })
        : await getPosts(pageSize, lastDoc);
    }
    setPosts((prevPosts) => [...prevPosts, ...results.posts]);
    setLastDoc(results.lastVisible);
    if (results.posts.length < pageSize) {
      setHasMore(false);
    }
    setLoading(false);
  };

  return (
    <div className="mt-4 pb-72">
      {posts &&
        posts.map((post) => <Post key={post.id} id={post.id} post={post} />)}
      {loading && <DataLoading />}
      {!loading && hasMore && (
        <button
          className="btn btn-active btn-neutral w-full mx-auto bg-black mt-4 border-none"
          onClick={loadPosts}
        >
          Load more
        </button>
      )}
      {!hasMore && <p>No more posts</p>}
    </div>
  );
};

export default PostsSection;
