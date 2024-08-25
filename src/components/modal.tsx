"use client";
import { FC } from "react";
import { IPost } from "@/types";
import PostEditForm from "./post-edit-form";

interface IProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  target: string;
  post: IPost;
}

const Modal: FC<IProps> = ({ isOpen, setIsOpen, target, post }) => {
  if (!isOpen) return null;

  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Edit Post</h3>
            <PostEditForm
              postId={post.id}
              currentText={post.text}
              currentImageUrl={post.image}
              closeModal={handleCloseModal}
            />
            <button className="btn" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
