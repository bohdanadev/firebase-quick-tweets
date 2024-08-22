"use client";

import { FC } from "react";

interface IProps {
  onLoadMore: () => void;
}

const Pagination: FC<IProps> = ({ onLoadMore }) => {
  return (
    <button
      className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg"
      onClick={onLoadMore}
    >
      Load more
    </button>
  );
};

export default Pagination;
