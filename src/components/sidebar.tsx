"use client";
import { FC } from "react";
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
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import SidebarLink from "./sidebar-link";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { logout } from "@/actions/auth-action";
import { useAuth } from "@/context/auth-context";

const Sidebar: FC = () => {
  const { user } = useAuth();

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
      <button
        className="hidden xl:inline ml-auto bg-[#1a8cd8] text-white rounded-full w-56 h-[52px] text-lg font-bold shadow-md hover:bg-accent"
        // onClick={setIsOpen}
      >
        Tweet
      </button>
      <div className="dropdown dropdown-top">
        <div
          tabIndex={0}
          role="button"
          className="text-[#d9d9d9] flex items-center justify-center mt-auto hoverAnimation xl:ml-auto xl:-mr-5"
        >
          {user?.profilePhoto ? (
            <Image
              src={user?.profilePhoto}
              alt="user"
              width={10}
              height={10}
              className="h-10 w-10 rounded-full xl:mr-2.5"
            />
          ) : (
            <div className="avatar online placeholder">
              <div className="bg-neutral text-neutral-content w-16 rounded-full">
                <span className="text-xl">
                  {user?.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
          <div className="hidden xl:inline leading-5 mx-2">
            <h4 className="font-bold">{user?.username}</h4>
          </div>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <li>
            <a href={`users/${user?.id}`}>Edit profile</a>
          </li>
          <li>
            <a>
              <div onClick={logout}>Logout</div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
