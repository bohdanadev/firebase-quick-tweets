import { FC } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

interface IProps {
  Icon: any;
  text: string;
  active?: boolean;
}

const SidebarLink: FC<IProps> = ({ Icon, text, active }) => {
  return (
    <Link
      href={"/posts"}
      className={`text-[#d9d9d9] flex items-center justify-center xl:justify-start text-xl space-x-3 hoverAnimation ${
        active && "font-bold"
      }`}
      onClick={() => active}
    >
      <Icon className="h-7" />
      <span className="hidden xl:inline">{text}</span>
    </Link>
  );
};

export default SidebarLink;
