import { getTrendings } from "@/lib/firebase/trending-posts";
import Image from "next/image";
import { FC } from "react";
import Trending from "./trending";

const Widgets: FC = async () => {
  // const trendingPosts = await getTrendings();
  return (
    <div className="hidden lg:inline ml-8 xl:w-[450px] py-1 space-y-5">
      {/* <div className="text-[#d9d9d9] space-y-3 bg-[#15181c] pt-2 rounded-xl w-11/12 xl:w-9/12">
        <h4 className="font-bold text-xl px-4">{`What's happening`}</h4>
        {trendingPosts.map((post) => (
          <Trending key={post.id} post={post} />
        ))}
        <button className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-3 cursor-pointer transition duration-200 ease-out flex items-center justify-between w-full text-[#1d9bf0] font-light">
          Show more
        </button>
      </div>

      <div className="text-[#d9d9d9] space-y-3 bg-[#15181c] pt-2 rounded-xl w-11/12 xl:w-9/12">
        <h4 className="font-bold text-xl px-4">Who to follow</h4>
        {trendingPosts.map((post) => (
          <div
            className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-2 cursor-pointer transition duration-200 ease-out flex items-center"
            key={post.id}
          >
            <Image
              src={post.userImg}
              alt="topUser"
              width={50}
              height={50}
              objectFit="cover"
              className="rounded-full"
            />
            <div className="ml-4 leading-5 group">
              <h4 className="font-bold group-hover:underline">
                {post.username}
              </h4>
            </div>
            <button className="ml-auto bg-white text-black rounded-full font-bold text-sm py-1.5 px-3.5">
              Follow
            </button>
          </div>
        ))}
        <button className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-3 cursor-pointer transition duration-200 ease-out flex items-center justify-between w-full text-[#1d9bf0] font-light">
          Show more
        </button>
      </div> */}
    </div>
  );
};

export default Widgets;
