import React, { Dispatch, FC, SetStateAction } from "react";
import Comment from "./comment";
import CommentInput from "./comment-input";
import { IComment, IPost } from "@/types";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";

interface IProps {
  post: IPost;
  comments: IComment[];
  setComments: Dispatch<SetStateAction<IComment[]>>;
}

const CommentsComponent: FC<IProps> = ({ post, comments, setComments }) => {
  return (
    <div className="dropdown dropdown-bottom">
      <div
        tabIndex={0}
        role="button"
        className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10"
      >
        <ChatBubbleOvalLeftEllipsisIcon className="h-5 group-hover:text-[#1d9bf0]" />
        {comments.length > 0 && (
          <span className="group-hover:text-[#1d9bf0] text-sm">
            {comments.length}
          </span>
        )}
      </div>
      <div
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-lg z-[1] w-96 p-4 shadow-lg"
      >
        {comments?.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            post={post}
            setComments={setComments}
          />
        ))}
        <CommentInput post={post} setComments={setComments} />
      </div>
    </div>
  );
};

export default CommentsComponent;
