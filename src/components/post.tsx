"use client";
import React, { FC, useEffect, useState } from "react";
import {
  ArrowsRightLeftIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  PencilSquareIcon,
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
import Comment from "./comment";
import CommentInput from "./comment-input";

interface IProps {
  id: string;
  post: IPost;
  postPage?: boolean;
}

const Post: FC<IProps> = ({ id, post, postPage }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [comments, setComments] = useState<IComment[]>([]);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const fetchComments = async () => {
      setComments(await getComments(id));
    };
    fetchComments();
  }, [id]);

  useEffect(() => {
    const isLike = post.likes.findIndex((like) => like === user?.id) !== -1;
    setLiked(isLike);
  }, [post.likes, user?.id]);

  const likePostHandler = async () => {
    if (!liked) {
      await likePostAction(id, user?.id!);
      if (!likes.includes(user?.id!)) {
        setLikes((prevState) => [...prevState, user?.id!]);
        setLiked(true);
      }
    } else {
      await unlikePostAction(id, user?.id!);
      setLikes((prevState) => prevState.filter((like) => like !== user?.id));
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
        <Link href={`/users/${post.userId}`} className="flex justify-center">
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
                className="h-11 w-11 rounded-full mr-4 max-h-[500px]"
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
                <p className="text-gray-400 text-[15px] sm:text-base mt-0.5 text-justify">
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
          <p className="text-gray-400 mt-0.5 text-m text-justify">
            {post.text}
          </p>
        )}
        {post.image && (
          <Link href={`/posts/${id}`} className="flex justify-center">
            <Image
              src={post.image}
              alt="postImage"
              width={300}
              height={300}
              className="rounded-2xl object-cover mr-2 position-relative"
            />
          </Link>
        )}

        <div
          className={`text-[#6e767d] flex justify-between w-10/12 ${
            postPage && "mx-auto"
          }`}
        >
          {!postPage && (
            <CommentsComponent
              post={post}
              comments={comments}
              setComments={setComments}
            />
          )}

          {user?.id === post.userId ? (
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
            {likes && likes.length > 0 && (
              <span
                className={`group-hover:text-pink-600 text-sm ${
                  liked && "text-pink-600"
                }`}
              >
                {likes.length}
              </span>
            )}
          </div>

          <div className="icon group">
            <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
          {postPage && post.userId === user?.id && (
            <div className="icon group" onClick={() => setIsOpen(true)}>
              <PencilSquareIcon className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
          )}
        </div>
        {postPage && (
          <div>
            <div className="divider divider-neutral"></div>
            {comments &&
              comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  post={post}
                  setComments={setComments}
                  postPage={true}
                />
              ))}
            <CommentInput
              post={post}
              setComments={setComments}
              postPage={true}
            />
          </div>
        )}
      </div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} target="post" post={post} />
    </div>
  );
};

export default Post;
