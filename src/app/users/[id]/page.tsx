import PostsSection from "@/components/posts-section";
import Profile from "@/components/profile";
import Sidebar from "@/components/sidebar";
import Widgets from "@/components/widgets";
import { getPosts } from "@/lib/firebase/post";
import { FC } from "react";

interface IProps {
  params: {
    id: string;
  };
}

const UserPage: FC<IProps> = async ({ params: { id } }) => {
  const pageSize = 3;
  const { posts: initialPosts, lastVisible } = await getPosts(pageSize, {
    userId: id,
  });

  return (
    <div className="flex h-screen bg-base-100">
      <div className="w-1/4">
        <Sidebar />
      </div>

      <div className="w-1/2 flex flex-col p-4">
        <Profile userId={id} />

        {/* <PostsSection
          initialPosts={initialPosts}
          userId={id}
          lastVisible={lastVisible}   
        />*/}
      </div>
      <div className="w-1/4">
        <Widgets />
      </div>
    </div>
  );
};
export default UserPage;
