import { FC, Suspense } from "react";

import Feed from "@/components/feed";
import Sidebar from "@/components/sidebar";
import Widgets from "@/components/widgets";
import DataLoading from "../loading";

const PostsPage: FC = () => {
  return (
    <div className="">
      <div className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar />
        <Suspense fallback={<DataLoading />}>
          <Feed />
        </Suspense>
        <Suspense fallback={<DataLoading />}>
          <Widgets />
        </Suspense>
      </div>
    </div>
  );
};

export default PostsPage;
