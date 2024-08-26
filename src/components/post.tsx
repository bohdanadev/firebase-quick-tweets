"use client";
import React, { FC, useEffect, useState } from "react";
import {
  ArrowsRightLeftIcon,
  ChartBarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  PencilSquareIcon,
  ShareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Moment from "react-moment";
import {
  HeartIcon as HeartIconFilled,
  ChatBubbleLeftEllipsisIcon as ChatIconFilled,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IComment, IPost } from "@/types";
import {
  deletePost,
  likePostAction,
  unlikePostAction,
} from "@/actions/post-action";
import Link from "next/link";
import Modal from "./modal";
import avatar from "@/assets/avatar.jpg";
import { useUser } from "@/lib/getUser";
import { getComments } from "@/lib/firebase/comment";
import CommentsComponent from "./comments";

interface IProps {
  id: string;
  post: IPost;
  searchParams?: Record<string, string> | null | undefined;
  postPage?: boolean;
}

const Post: FC<IProps> = ({ id, post, searchParams, postPage }) => {
  const [liked, setLiked] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [comments, setComments] = useState<IComment[]>([]);
  const router = useRouter();
  const { user } = useUser();
  const show = searchParams?.show;
  const target = searchParams?.target;

  useEffect(() => {
    const fetchComments = async () => {
      setComments(await getComments(id));
    };
    fetchComments();
  }, [id]);

  useEffect(() => {
    const isLike = post.likes.findIndex((like) => like === user?.uid) !== -1;
    setLiked(isLike);
  }, [post.likes, user?.uid]);

  const likePostHandler = async () => {
    if (!liked) {
      await likePostAction(id, user?.uid);
      if (!post.likes.includes(user?.uid)) {
        post.likes.push(user?.uid);
        setLiked(true);
      }
    } else {
      await unlikePostAction(id, user?.uid);
      post.likes.filter((like) => like !== user?.uid);
      setLiked(false);
    }
  };

  const deletePostHandler = async () => {
    await deletePost(id);
    router.push("/posts");
  };

  return (
    <div className="p-3 flex cursor-pointer border-b border-gray-700">
      {!postPage && (
        <Link href={`/users/${post.userId}`}>
          <Image
            src={post.userImg ?? avatar}
            alt="userAvatar"
            width={11}
            height={11}
            className="h-11 w-11 rounded-full mr-4"
          />
        </Link>
      )}
      <div className="flex flex-col space-y-2 w-full">
        <div className={`flex ${!postPage && "justify-between"}`}>
          {postPage && (
            <Link href={`/users/${post.userId}`}>
              <Image
                src={post.userImg ?? avatar}
                alt="Profile Pic"
                width={11}
                height={11}
                className="h-11 w-11 rounded-full mr-4"
              />
            </Link>
          )}
          <div className="text-[#6e767d]">
            <Link href={`/users/${post.userId}`}>
              <div className="inline-block group">
                <h4
                  className={`font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline ${
                    !postPage && "inline-block"
                  }`}
                >
                  {post.username}
                </h4>
              </div>
            </Link>
            ·{" "}
            <span className="hover:underline text-sm sm:text-[15px]">
              <Moment fromNow>{post.timestamp}</Moment>
            </span>
            {!postPage && (
              <Link href={`/posts/${id}`}>
                <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
                  {post.text}
                </p>
              </Link>
            )}
          </div>
          <div className="icon group flex-shrink-0 ml-auto">
            <EllipsisHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
          </div>
        </div>
        {postPage && (
          <p className="text-[#d9d9d9] mt-0.5 text-xl">{post.text}</p>
        )}
        <Image
          src={post.image}
          alt="postImage"
          width={100}
          height={100}
          className="rounded-2xl max-h-[700px] object-cover mr-2 position-relative"
        />
        <div
          className={`text-[#6e767d] flex justify-between w-10/12 ${
            postPage && "mx-auto"
          }`}
        >
          {!postPage && (
            <CommentsComponent post={post} comments={comments} user={user} />
          )}

          {user?.uid === post.userId ? (
            <div
              className="flex items-center space-x-1 group"
              onClick={deletePostHandler}
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
            onClick={likePostHandler}
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
          {postPage && post.userId === user?.uid && (
            <div className="icon group" onClick={() => setIsOpen(true)}>
              <PencilSquareIcon className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        target={target!}
        post={post}
      />
    </div>
  );
};

export default Post;
