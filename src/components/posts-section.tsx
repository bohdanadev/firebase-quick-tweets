"use client";

import { FC, useEffect, useState } from "react";
import Post from "@/components/post";
import { getPosts } from "@/lib/firebase/post";
import { IPost } from "@/types";
import DataLoading from "@/app/loading";
import { useUser } from "@/lib/getUser";

interface IProps {
  userId?: string;
  searchTerm?: string;
  showMyPosts?: boolean;
}

const PostsSection: FC<IProps> = ({ userId, searchTerm, showMyPosts }) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [lastDoc, setLastDoc] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { user } = useUser();

  useEffect(() => {
    const fetchPosts = async () => {
      const pageSize = 4;
      if (showMyPosts && user) {
        const { posts, lastVisibleId } = await getPosts(
          pageSize,
          undefined,
          user.id
        );

        setPosts([...posts]);
        setLastDoc(lastVisibleId);
      } else if (userId) {
        const { posts: initialPosts, lastVisibleId } = await getPosts(
          pageSize,
          undefined,
          userId
        );
        setPosts(...[initialPosts]);
        setLastDoc(lastVisibleId);
      } else if (searchTerm) {
        const filteredPosts = await getPosts(pageSize, undefined, undefined, {
          text: searchTerm,
        });
        setPosts([...filteredPosts.posts]);
      } else {
        const { posts, lastVisibleId } = await getPosts(pageSize);
        setPosts([...posts]);
        setLastDoc(lastVisibleId);
      }
    };
    fetchPosts();
  }, [searchTerm, showMyPosts, user, userId]);

  const loadPosts = async () => {
    setLoading(true);

    const pageSize = 4;
    if (lastDoc) {
      let results;
      if (userId || showMyPosts) {
        const userIdForFetch = showMyPosts ? user?.id : userId;
        results = searchTerm
          ? await getPosts(pageSize, lastDoc, userIdForFetch, {
              text: searchTerm,
            })
          : await getPosts(pageSize, lastDoc, userIdForFetch);
      } else {
        results = searchTerm
          ? await getPosts(pageSize, lastDoc, undefined, { text: searchTerm })
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
        posts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            mappedPost={post}
            setPosts={setPosts}
          />
        ))}
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
