import { FC } from "react";

import Feed from "@/components/feed";
import Sidebar from "@/components/sidebar";
import Widgets from "@/components/widgets";

const PostsPage: FC = async () => {
  return (
    <div className="">
      <div>
        <h3>QuickTweets</h3>
      </div>

      <div className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar />
        <Feed />
        <Widgets />
      </div>
    </div>
  );
};

export default PostsPage;
