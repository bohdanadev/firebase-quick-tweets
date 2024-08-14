import AuthForm from "@/components/auth-form";
import Feed from "@/components/feed";
import Sidebar from "@/components/sidebar";
import Widgets from "@/components/widgets";
import { FC } from "react";

interface IProps {
  searchParams: {
    mode: string;
  };
}

const Home: FC<IProps> = ({ searchParams }) => {
  const formMode = searchParams.mode;

  if (formMode) return <AuthForm mode={formMode} />;

  return (
    <div className="">
      <div>
        <h3>Home / Twitter</h3>
      </div>

      <div className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar />
        <Feed />
        <Widgets />
      </div>
    </div>
  );
};

export default Home;
