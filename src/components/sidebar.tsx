"use client";
import { FC, useEffect, useState } from "react";
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
} from "@heroicons/react/24/outline";
import SidebarLink from "./sidebar-link";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { deleteAccount, getUser, signout } from "@/lib/firebase/user";
import { useUser } from "@/lib/getUser";
import { useRouter } from "next/navigation";

const Sidebar: FC = () => {
  const router = useRouter();
  const { user: currentUser } = useUser();

  const logout = async () => {
    await signout()
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
        <Link href="/posts">
          <Image src={logo} width={100} height={100} priority alt="logo" />
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

      <div className="dropdown dropdown-top xl:ml-24">
        <div
          tabIndex={0}
          role="button"
          className="text-[#d9d9d9] flex items-center justify-center mt-auto hoverAnimation xl:ml-auto xl:-mr-5"
        >
          {currentUser?.profilePhoto ? (
            <Image
              src={currentUser.profilePhoto}
              alt="user"
              width={80}
              height={80}
              quality={80}
              className="h-20 w-20 rounded-full xl:mr-2.5"
            />
          ) : (
            <div className="avatar online placeholder">
              <div className="bg-neutral text-neutral-content w-16 rounded-full">
                <span className="text-xl">
                  {currentUser?.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
          <div className="hidden xl:inline leading-5 mx-2">
            <h4 className="font-bold">{currentUser?.username}</h4>
          </div>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-neutral-content rounded-box z-[1] w-52 p-2 shadow"
        >
          <li>
            <Link href={`/users/${currentUser?.id}`}>
              <p>Edit profile</p>
            </Link>
          </li>
          <li>
            <a>
              <div onClick={() => deleteAccount(currentUser)}>
                Delete account
              </div>
            </a>
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
