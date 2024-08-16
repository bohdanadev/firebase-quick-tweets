import { FC } from "react";
import { getAuth, signOut } from "firebase/auth";
import { firestore, app } from "@/lib/firebase";
import Image from "next/image";
import { HomeIcon } from "@heroicons/react/24/solid";
import {
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  EllipsisHorizontalCircleIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import SidebarLink from "./sidebar-link";
import { useRouter } from "next/navigation";
import Link from "next/link";
import logo from "@/assets/logo.png";

interface IProps {
  currentUser: IUser;
}

const Sidebar: FC<IProps> = ({ currentUser }) => {
  const router = useRouter();
  const auth = getAuth(app);

  console.log(auth);

  const logoutClick = async () => {
    await signOut(auth)
      .then(() => {
        router.push("/?mode=login");
      })
      .catch((error: unknown) => {
        console.error("Error logging out:", error);
        throw new Error("Error logging out");
      });
  };

  return (
    <div className="hidden sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full">
      <div className="flex items-center justify-center w-14 h-14 hoverAnimation p-0 xl:ml-24">
        <Link href="/">
          <Image src={logo} width={30} height={30} priority alt="logo" />
        </Link>
      </div>
      <div className="space-y-2.5 mt-4 mb-2.5 xl:ml-24">
        <SidebarLink text="Home" Icon={HomeIcon} active={true} />
        <SidebarLink text="Explore" Icon={HashtagIcon} />
        <SidebarLink text="Notifications" Icon={BellIcon} />
        <SidebarLink text="Messages" Icon={InboxIcon} />
        <SidebarLink text="Bookmarks" Icon={BookmarkIcon} />
        <SidebarLink text="Lists" Icon={ClipboardDocumentListIcon} />
        <SidebarLink text="Profile" Icon={UserIcon} />
        <SidebarLink text="More" Icon={EllipsisHorizontalCircleIcon} />
      </div>
      <button className="hidden xl:inline ml-auto bg-accent text-white rounded-full w-56 h-[52px] text-lg font-bold shadow-md hover:bg-[#1a8cd8]">
        Tweet
      </button>
      <div
        className="text-[#d9d9d9] flex items-center justify-center mt-auto hoverAnimation xl:ml-auto xl:-mr-5"
        onClick={logoutClick}
      >
        <Image
          src={currentUser.profilePhoto}
          alt="user"
          width={10}
          height={10}
          className="h-10 w-10 rounded-full xl:mr-2.5"
        />
        <div className="hidden xl:inline leading-5">
          <h4 className="font-bold">{currentUser.username}</h4>
          <p className="text-[#6e767d]">@{currentUser.tag}</p>
        </div>
        <EllipsisHorizontalIcon className="h-5 hidden xl:inline ml-10" />
      </div>
    </div>
  );
};

export default Sidebar;
