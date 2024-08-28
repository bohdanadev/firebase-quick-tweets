"use client";
import {
  Dispatch,
  FC,
  FormEvent,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  CalendarIcon,
  ChartBarIcon,
  FaceSmileIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { IPost, IReplyComment, IUser } from "@/types";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { getUser } from "@/lib/firebase/user";
import { createComment, createReplyComment } from "@/actions/post-action";
import { SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";
import { useUser } from "@/lib/getUser";

interface IProps {
  post: IPost;
  commentId?: string;
  setOpenReply?: Dispatch<SetStateAction<boolean>>;
  setReplies?: Dispatch<SetStateAction<IReplyComment[]>>;
}

interface ICommentFormData {
  comment: string;
}

const CommentInput: FC<IProps> = ({
  post,
  commentId,
  setOpenReply,
  setReplies,
}) => {
  const [userData, setUserData] = useState<IUser | null>(null);
  const { register, handleSubmit, setValue, getValues, reset } =
    useForm<ICommentFormData>();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const fetchUser = async () => {
        const response = await getUser(user.uid);
        if (response) {
          setUserData(response);
        } else {
          setUserData(null);
        }
      };
      fetchUser();
    }
  }, [user]);

  const name = user?.displayName ?? userData?.username!;
  const image = user?.photoURL ?? (userData?.profilePhoto || null);

  const addEmoji = (e: any) => {
    let sym = e.unified.split("-");
    let codesArray: any = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    const currentValue = getValues("comment");
    const newValue = currentValue + emoji;

    setValue("comment", newValue, {
      shouldValidate: true,
    });
  };

  const addCommentHandler: SubmitHandler<ICommentFormData> = async (data) => {
    await createComment(post.id, data.comment, user?.uid, name, image);
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
        user?.uid,
        name,
        image
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
    <div className="border border-slate-300 w-full">
      {commentId && (
        <div className="icon" onClick={closeReplyInput}>
          <XMarkIcon className="text-[#1d9bf0] h-[22px]" />
        </div>
      )}
      <div className="mt-7 flex space-x-3 w-full ">
        <Image
          src={user?.photoURL ?? userData?.profilePhoto}
          alt=""
          width={11}
          height={11}
          className="h-11 w-11 rounded-full"
        />
        <h4>{user?.displayName ?? userData?.username}</h4>
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
            className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-300 tracking-wide w-full min-h-[80px] border-b border-gray-600 focus:border-blue-500"
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

            {showEmojiPicker && (
              <Picker
                data={data}
                onEmojiSelect={addEmoji}
                style={{
                  position: "absolute",
                  marginTop: "465px",
                  marginLeft: -40,
                  maxWidth: "320px",
                  borderRadius: "20px",
                }}
                theme="dark"
              />
            )}

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
