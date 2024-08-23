"use client";
import React, { FC, useEffect, useState } from "react";
import {
  ArrowsRightLeftIcon,
  ChartBarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Moment from "react-moment";
import {
  HeartIcon as HeartIconFilled,
  ChatBubbleLeftEllipsisIcon as ChatIconFilled,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  deletePostWithComments,
  likePost,
  unlikePost,
} from "@/lib/firebase/post";
import { IComment, IPost, IUser } from "@/types";
import { getComments } from "@/lib/firebase/comment";
import { useAuth } from "@/context/auth-context";
import {
  deletePost,
  likePostAction,
  unlikePostAction,
} from "@/actions/post-action";
import Link from "next/link";
import { User } from "firebase/auth";

interface IProps {
  id: string;
  post: IPost;
  user: User | null;
  // postPage: number;
}

const Post: FC<IProps> = ({ id, post, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [postId, setPostId] = useState<string>("");
  //const [comments, setComments] = useState<IComment[]>([]);
  const [liked, setLiked] = useState(false);
  const router = useRouter();

  console.log("USER", user);

  //const post = {
  //  id: "1",
  //  username: "Me",
  //  userImg: "assets/logo.png",
  //  tag: "hello",
  //  text: "The first Post",
  //  image: "assets/me.jpg",
  //};

  // useEffect(() => {
  //   const fetchComments = async () => {
  //     try {
  //       setComments(await getComments(id));
  //     } catch (error) {
  //       console.error("Error fetching comments:", error);
  //     }
  //   };
  //   fetchComments();
  // }, [id]);

  useEffect(() => {
    const isLike = post.likes.findIndex((like) => like === user?.uid) !== -1;
    setLiked(isLike);
  }, [post.likes, user?.uid]);

  const likePostHandler = async () => {
    if (!liked) {
      await likePostAction(id, user?.uid!);
      if (!post.likes.includes(user?.uid!)) {
        post.likes.push(user?.uid!);
        setLiked(true);
      }
      setLiked(true);
    } else {
      await unlikePostAction(id, user?.uid!);
      post.likes.filter((like) => like !== user?.uid);
      setLiked(false);
    }
  };

  const deletePostHandler = async () => {
    await deletePost(id);
    router.push("/posts");
  };

  return (
    <div
      className="p-3 flex cursor-pointer border-b border-gray-700"
      // onClick={() => router.push(`/${id}`)}
    >
      {/* {!postPage && (
        <Image
          src={post?.userImg}
          alt=""
          width={11}
          height={11}
          className="h-11 w-11 rounded-full mr-4"
        />
      )} */}
      <div className="flex flex-col space-y-2 w-full">
        <Link href={`/users/${post.userId}`}>
          <div className={`flex `}>
            {/* {postPage && (   */}
            <Image
              src={post.userImg}
              alt="Profile Pic"
              className="h-11 w-11 rounded-full mr-4"
            />
            {/*  )}    */}
            <div className="text-[#6e767d]">
              <div className="inline-block group">
                <h4 className="font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline">
                  {post?.username}
                </h4>
              </div>
              ·{" "}
              <span className="hover:underline text-sm sm:text-[15px]">
                <Moment fromNow>{post?.timestamp}</Moment>
              </span>
              {/*   {!postPage && (
              <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
                {post?.text}
              </p>
            )} */}
            </div>
            <div className="icon group flex-shrink-0 ml-auto">
              <EllipsisHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
            </div>
          </div>
        </Link>
        {/* {postPage && (  */}
        <p className="text-[#d9d9d9] mt-0.5 text-xl">{post?.text}</p>
        {/*  )}   */}
        <Image
          src={post.image}
          alt="post"
          width={500}
          height={450}
          className="rounded-2xl max-h-[700px] object-cover mr-2 position-relative"
        />
        <div className={`text-[#6e767d] flex justify-between w-10/12 `}>
          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              // setPostId(id);
              setIsOpen(true);
            }}
          >
            <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
              <ChatBubbleOvalLeftEllipsisIcon className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
            {post.comments.length > 0 && (
              <span className="group-hover:text-[#1d9bf0] text-sm">
                {post.comments.length}
              </span>
            )}
          </div>

          {user?.uid === post.userId ? (
            <div
              className="flex items-center space-x-1 group"
              onClick={
                // e.stopPropagation();
                //deleteDoc(doc(db, "posts", id));
                deletePostHandler
                // router.push("/posts");
              }
            >
              <div className="icon group-hover:bg-red-600/10">
                <TrashIcon className="h-5 group-hover:text-red-600" />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-1 group">
              <div className="icon group-hover:bg-green-500/10">
                <ArrowsRightLeftIcon className="h-5 group-hover:text-green-500" />
              </div>
            </div>
          )}

          <div
            className="flex items-center space-x-1 group"
            onClick={
              likePostHandler
              // e.stopPropagation();
              // likePost(id);
            }
          >
            <div className="icon group-hover:bg-pink-600/10">
              {liked ? (
                <HeartIconFilled className="h-5 text-pink-600" />
              ) : (
                <HeartIcon className="h-5 group-hover:text-pink-600" />
              )}
            </div>
            {post.likes && post.likes.length > 0 && (
              <span
                className={`group-hover:text-pink-600 text-sm ${
                  liked && "text-pink-600"
                }`}
              >
                {post.likes.length}
              </span>
            )}
          </div>

          <div className="icon group">
            <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
          <div className="icon group">
            <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
