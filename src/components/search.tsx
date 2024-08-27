"use client";
import React, {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useState,
} from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface IProps {
  // setSearchText: Dispatch<SetStateAction<string | null>>;
  handleSearch: any;
}

const Search: FC<IProps> = ({ handleSearch }) => {
  const [value, setValue] = useState<string>("");
  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.target.value);
    setTimeout(() => {
      //  setSearchText(e.target.value);
      handleSearch(e.target.value);
    }, 1000);
  };
  return (
    <div className="sticky top-0 ml-10 py-1.5 bg-black z-50 w-7/12 xl:w-6/12">
      <div className="flex items-center bg-[#202327] p-3 rounded-full relative">
        <MagnifyingGlassIcon className="text-gray-500 h-5 z-50" />
        <input
          type="text"
          className="bg-transparent placeholder-gray-500 outline-none text-[#d9d9d9] absolute inset-0 pl-11 border border-transparent w-full focus:border-[#1d9bf0] rounded-full focus:bg-black focus:shadow-lg"
          placeholder="Search posts..."
          value={value}
          onChange={handle}
        />
      </div>
    </div>
  );
};

export default Search;
