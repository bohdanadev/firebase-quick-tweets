"use client";
import { IComment, IPost, IReplyComment } from "@/types";
import {
  ChartBarIcon,
  ChatBubbleOvalLeftIcon,
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import avatar from "@/assets/avatar.jpg";
import Moment from "react-moment";
import { deleteComment, editComment } from "@/actions/post-action";
import { useUser } from "@/lib/getUser";
import CommentInput from "./comment-input";
import { getReplies } from "@/lib/firebase/comment";
import Reply from "./comment-reply";

interface IProps {
  comment: IComment;
  post: IPost;
  setComments: Dispatch<SetStateAction<IComment[]>>;
  postPage?: boolean;
}

const Comment: FC<IProps> = ({ comment, post, setComments, postPage }) => {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>("");
  const [openReply, setOpenReply] = useState<boolean>(false);
  const [replies, setReplies] = useState<IReplyComment[]>([]);

  const { user } = useUser();
  useEffect(() => {
    const getCommentReplies = async () => {
      const results = await getReplies(post.id, comment.id);
      setReplies(results);
    };
    getCommentReplies();
  }, [post.id, comment.id]);

  const handleEditClick = (comment: IComment) => {
    setEditingCommentId(comment.id);
    setEditedText(comment.comment);
  };

  const handleEditSubmit = async () => {
    await editComment(post.id, comment.id, editedText);
    setEditingCommentId(null);
    setEditedText("");
  };
  const handleDeleteSubmit = async () => {
    await deleteComment(comment.postId, comment.id);
    setComments((prevState) =>
      prevState.filter((item) => item.id !== comment.id)
    );
  };

  return (
    <div className="p-3 flex cursor-pointer border-b border-gray-700">
      <Image
        src={comment.userImg ?? avatar}
        alt=""
        width={8}
        height={8}
        className="h-8 w-8 rounded-full mr-4"
      />
      <div className="flex flex-col space-y-2 w-full">
        <div className="flex justify-between">
          <div className="text-[#6e767d]">
            <Link href={`/users/${comment.userId}`}>
              <div className="inline-block group">
                <h4 className="font-bold text-[#d9d9d9] text-[15px] sm:text-base inline-block group-hover:underline mt-1">
                  {comment?.username}
                </h4>
              </div>
            </Link>{" "}
            ·{" "}
            <span className="hover:underline text-xs sm:text-[12px]">
              <Moment fromNow>{comment?.timestamp}</Moment>
            </span>
            {editingCommentId === comment.id ? (
              <>
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="textarea textarea-bordered textarea-xs w-full max-w-xs"
                ></textarea>

                <button
                  className="btn btn-sm btn-accent"
                  onClick={handleEditSubmit}
                >
                  Send
                </button>
              </>
            ) : (
              <p
                className={`${
                  postPage ? "text-neutral-200" : "text-black"
                } mt-0.5 max-w-lg overflow-scroll text-[15px] sm:text-base`}
              >
                {comment?.comment}
              </p>
            )}
            {openReply && (
              <div className="border border-slate-300 w-full">
                {replies &&
                  replies.map((reply) => (
                    <Reply key={reply?.id} reply={reply} />
                  ))}
                <CommentInput
                  post={post}
                  commentId={comment.id}
                  setOpenReply={setOpenReply}
                  setReplies={setReplies}
                />
              </div>
            )}
          </div>
          <div className="icon group flex-shrink-0">
            <EllipsisHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
          </div>
        </div>

        <div className="text-[#6e767d] flex justify-between w-10/12">
          <div className="icon group" onClick={() => setOpenReply(true)}>
            <ChatBubbleOvalLeftIcon className="h-5 group-hover:text-[#1d9bf0]" />
            {replies && replies.length > 0 && <span>{replies?.length}</span>}
          </div>

          {comment.userId === user?.uid && (
            <>
              <div
                className="icon group-hover:bg-pink-600/10"
                onClick={() => handleEditClick(comment)}
              >
                <PencilSquareIcon className="h-5 group-hover:text-pink-600" />
              </div>

              <div className="icon group" onClick={handleDeleteSubmit}>
                <TrashIcon className="h-5 group-hover:text-[#1d9bf0]" />
              </div>
            </>
          )}
          <div className="icon group">
            <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
