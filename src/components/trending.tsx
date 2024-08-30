import { IPost } from "@/types";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface IProps {
  post: IPost;
}

const Trending: FC<IProps> = ({ post }) => {
  return (
    <div className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-2 cursor-pointer transition duration-200 ease-out flex items-center justify-between">
      <Link href={`/posts/${post.id}`} className="flex flex-col items-center">
        <div className="space-y-0.5">
          <p className="text-[#6e767d] text-xs font-medium text-justify">
            {post.text}
          </p>
        </div>

        {post.image ? (
          <Image
            src={post.image}
            alt="postImage"
            width={70}
            height={70}
            objectFit="cover"
            className="rounded-2xl"
          />
        ) : (
          <div className="icon group">
            <EllipsisHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
          </div>
        )}
      </Link>
    </div>
  );
};

export default Trending;
