import React, { FC } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Search: FC = () => {
  return (
    <div className="sticky top-0 py-1.5 bg-black z-50 w-11/12 xl:w-9/12">
      <div className="flex items-center bg-[#202327] p-3 rounded-full relative">
        <MagnifyingGlassIcon className="text-gray-500 h-5 z-50" />
        <input
          type="text"
          className="bg-transparent placeholder-gray-500 outline-none text-[#d9d9d9] absolute inset-0 pl-11 border border-transparent w-full focus:border-[#1d9bf0] rounded-full focus:bg-black focus:shadow-lg"
          placeholder="Search..."
        />
      </div>
    </div>
  );
};

export default Search;
