"use client";
import {
  aggregateTrendingTopics,
  getTrendings,
} from "@/lib/firebase/trending-posts";
import Image from "next/image";
import { FC, useState } from "react";
import Trending from "./trending";
import Link from "next/link";
import { ITrendings } from "@/types";

const Widgets: FC = () => {
  const [trendingPosts, setTrendingPosts] = useState<ITrendings>();

  const fetchTrendings = async () => {
    await aggregateTrendingTopics();
    const trendingPosts = (await getTrendings()) as ITrendings;
    setTrendingPosts(trendingPosts);
  };

  return (
    <div className="hidden lg:inline ml-8 xl:w-[450px] py-1 space-y-5 overflow-y-auto sticky h-full">
      <div
        className="text-[#d9d9d9] space-y-1 bg-[#15181c] mt-2 pt-1 rounded-xl w-11/12 xl:w-9/12 text-center"
        onClick={fetchTrendings}
      >{`What's happening?`}</div>

      {trendingPosts && (
        <>
          <div className="text-[#d9d9d9] space-y-3 bg-[#15181c] pt-2 rounded-xl w-11/12 xl:w-9/12">
            <h4 className="font-bold text-xl px-4">{`What people are discussing?`}</h4>
            {trendingPosts?.topDiscussedPosts.map((post) => (
              <Trending key={post.id} post={post} />
            ))}
          </div>
          <div className="divider"></div>

          <div className="text-[#d9d9d9] space-y-3 bg-[#15181c] pt-2 rounded-xl w-11/12 xl:w-9/12">
            <h4 className="font-bold text-xl px-4">{`What people like?`}</h4>

            {trendingPosts?.topLikedPosts.map((post) => (
              <Trending key={post.id} post={post} />
            ))}
          </div>

          <div className="text-[#d9d9d9] space-y-3 bg-[#15181c] pt-2 rounded-xl w-11/12 xl:w-9/12">
            <h4 className="font-bold text-xl px-4">Who to follow</h4>
            {trendingPosts?.topDiscussedPosts.map((post) => (
              <div
                className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-2 cursor-pointer transition duration-200 ease-out flex items-center"
                key={post.id}
              >
                <Link
                  href={`/user/${post.userId}`}
                  className="flex items-center"
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
                </Link>
                <button className="ml-auto bg-white text-black rounded-full font-bold text-sm py-1.5 px-3.5">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Widgets;
