"use client";

import { FC, useEffect, useState } from "react";
import Post from "@/components/post";
import { getPosts } from "@/lib/firebase/post";
import { IPost } from "@/types";
import { DocumentData } from "firebase/firestore";

interface IProps {
  initialPosts: IPost[];
  lastVisible: DocumentData;
  userId?: string;
}

const PostsSection: FC<IProps> = ({ initialPosts, lastVisible, userId }) => {
  const [posts, setPosts] = useState<IPost[]>(initialPosts);
  const [lastDoc, setLastDoc] = useState<DocumentData>(lastVisible);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadPosts = async () => {
    setLoading(true);

    const pageSize = 3;
    const { posts: newPosts, lastVisible } = userId
      ? await getPosts(pageSize, lastDoc, userId)
      : await getPosts(pageSize, lastDoc);
    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setLastDoc(lastVisible);
    if (newPosts.length < pageSize) {
      setHasMore(false);
    }
    setLoading(false);
  };

  return (
    <div className="mt-4 pb-72">
      {posts &&
        posts.map((post) => <Post key={post.id} id={post.id} post={post} />)}
      {loading && <p>Loading...</p>}
      {!loading && hasMore && (
        <button className="btn btn-active btn-neutral" onClick={loadPosts}>
          Load more
        </button>
      )}
      {!hasMore && <p>No more posts</p>}
    </div>
  );
};

export default PostsSection;
