"use client";
import { Dispatch, FC, SetStateAction, useState } from "react";
import {
  CalendarIcon,
  ChartBarIcon,
  FaceSmileIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { IComment, IPost, IReplyComment } from "@/types";
import { createComment, createReplyComment } from "@/actions/post-action";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUser } from "@/lib/getUser";
import PickerComponent from "./emoji-picker";
import avatar from "@/assets/avatar.jpg";

interface IProps {
  post: IPost;
  commentId?: string;
  setOpenReply?: Dispatch<SetStateAction<boolean>>;
  setReplies?: Dispatch<SetStateAction<IReplyComment[]>>;
  setComments?: Dispatch<SetStateAction<IComment[]>>;
  postPage?: boolean;
}

interface ICommentFormData {
  comment: string;
}

const CommentInput: FC<IProps> = ({
  post,
  commentId,
  setOpenReply,
  setReplies,
  setComments,
  postPage,
}) => {
  const { register, handleSubmit, setValue, getValues, reset } =
    useForm<ICommentFormData>();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { user } = useUser();

  const addEmoji = (e: any) => {
    let sym = e.unified.split("-");
    let codesArray: any = [];
    sym.forEach((el: string) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    const currentValue = getValues("comment");
    const newValue = currentValue + emoji;

    setValue("comment", newValue, {
      shouldValidate: true,
    });
  };

  const addCommentHandler: SubmitHandler<ICommentFormData> = async (data) => {
    const newComment = await createComment(
      post.id,
      data.comment,
      user?.id!,
      user?.username!,
      user?.profilePhoto
    );
    if (setComments) {
      setComments((prevState) => [...prevState, newComment]);
    }
    reset();
  };

  const addCommentReplyHandler: SubmitHandler<ICommentFormData> = async (
    data
  ) => {
    if (commentId) {
      const newReply = await createReplyComment(
        post.id,
        commentId,
        data.comment,
        user?.id!,
        user?.username!,
        user?.profilePhoto
      );
      if (setReplies) {
        setReplies((prevState) => [...prevState, newReply]);
      }
    }
    reset();
  };

  const closeReplyInput = () => {
    if (setOpenReply) {
      setOpenReply(false);
    }
  };

  return (
    <div className="border-y border-slate-400 w-full p-4">
      {commentId && (
        <div className="icon" onClick={closeReplyInput}>
          <XMarkIcon className="text-red-500 h-[22px] color-red-500" />
        </div>
      )}
      <div className="mt-5 pl-2 flex space-x-3 w-full ">
        <img
          src={user?.profilePhoto ?? avatar}
          alt="user"
          width={8}
          height={8}
          className="h-8 w-8 rounded-full"
        />
        <h4 className="mt-2 pl-2">{user?.username}</h4>
      </div>
      <form
        onSubmit={handleSubmit(
          commentId ? addCommentReplyHandler : addCommentHandler
        )}
      >
        <div className="flex-grow mt-2">
          <textarea
            {...register("comment", { required: true })}
            placeholder="Tweet your reply"
            rows={2}
            className={`bg-transparent outline-none ${
              postPage ? "text-white" : "text-black"
            } text-lg placeholder-gray-300 pl-2 tracking-wide w-full min-h-[80px] border-b border-gray-600 focus:border-blue-500`}
          />
        </div>

        <div className="flex items-center justify-between pt-2.5">
          <div className="flex items-center">
            <div className="icon">
              <PhotoIcon className="text-[#1d9bf0] h-[22px]" />
            </div>

            <div className="icon rotate-90">
              <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
            </div>

            <div
              className="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <FaceSmileIcon className="text-[#1d9bf0] h-[22px]" />
            </div>

            {showEmojiPicker && <PickerComponent onEmojiSelect={addEmoji} />}

            <div className="icon">
              <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
            </div>
          </div>
          <button
            className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
            type="submit"
          >
            Reply
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentInput;
