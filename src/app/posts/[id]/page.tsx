import { FC } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Sidebar from "@/components/sidebar";
import Post from "@/components/post";
import Widgets from "@/components/widgets";
import Link from "next/link";

interface IProps {
  params: {
    id: string;
  };
}

const PostPage: FC<IProps> = async ({ params: { id } }) => {
  return (
    <div className="bg-black flex min-h-screen max-w-[1500px] mx-auto">
      <Sidebar />
      <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
        <div className="flex items-center px-1.5 py-2 border-b border-gray-700 text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black">
          <Link
            href="/posts"
            className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
          >
            <ArrowLeftIcon className="h-5 text-white" />
          </Link>
          Tweet
        </div>

        <Post id={id} postPage={true} />
      </div>
      <Widgets />
    </div>
  );
};

export default PostPage;
