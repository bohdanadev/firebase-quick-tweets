import { FC } from "react";
import { IReplyComment } from "@/types";
import avatar from "@/assets/avatar.jpg";
import Moment from "react-moment";
import Image from "next/image";

interface IProps {
  reply: IReplyComment;
}

const Reply: FC<IProps> = ({ reply }) => {
  return (
    <div className="w-full m-1">
      <Image
        src={reply.userImg ?? avatar}
        alt="user"
        width={32}
        height={32}
        className="h-8 w-8 rounded-full"
      />
      <div className="flex flex-col space-y-2 w-full">
        <div className="flex justify-between">
          <div className="text-[#6e767d]">
            <div className="inline-block group">
              <h4 className="font-bold text-[#d9d9d9] text-[15px] sm:text-base inline-block group-hover:underline">
                {reply.username}
              </h4>
            </div>
            ·{" "}
            <span className="hover:underline text-xs sm:text-[12px]">
              <Moment fromNow>{reply?.timestamp}</Moment>
            </span>
            <p className="text-black mt-0.5 max-w-lg overflow-scroll text-[15px] sm:text-base">
              {reply.comment}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reply;
