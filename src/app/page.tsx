"use client";
import { FC, useEffect, useState } from "react";
import AuthForm from "@/components/auth-form";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Feed from "@/components/feed";
import Sidebar from "@/components/sidebar";
import Widgets from "@/components/widgets";
import { getUser } from "@/lib/user";
import { useRouter } from "next/navigation";
import { RecoilRoot, useRecoilState } from "recoil";
import { modalState } from "@/lib/recoil-state/modal-atom";
import Modal from "@/components/modal";

interface IProps {
  searchParams: {
    mode: string;
  };
}

const HomePage: FC<IProps> = ({ searchParams }) => {
  const auth = getAuth(app);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const router = useRouter();
  const formMode = searchParams.mode;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const user = (await getUser(currentUser)) as IUser;
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        router.push("/?mode=login");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  if (currentUser == null) return <div>Loading...</div>;

  if (formMode) return <AuthForm mode={formMode} />;

  return (
    <div className="">
      <div>
        <h3>Home / QuickTweets</h3>
      </div>

      <div className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar currentUser={currentUser} />
        <Feed currentUser={currentUser} />
        <Widgets />
        {isOpen && (
          <RecoilRoot>
            <Modal currentUser={currentUser} />
          </RecoilRoot>
        )}
      </div>
    </div>
  );
};

export default HomePage;
