import { FC } from "react";
import Search from "./search";

const Widgets: FC = () => {
  return (
    <div className="hidden lg:inline ml-8 xl:w-[450px] py-1 space-y-5">
      <Search />
    </div>
  );
};

export default Widgets;
