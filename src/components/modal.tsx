"use client";
import { FC } from "react";
import { IPost, IUser } from "@/types";
import PostEditForm from "./post-edit-form";
import UserEditForm from "./user-edit-form";

interface IProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  target: string;
  post?: IPost;
  user?: IUser;
}

const Modal: FC<IProps> = ({ isOpen, setIsOpen, target, post, user }) => {
  if (!isOpen) return null;

  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {target === "post" ? "Edit Post" : "Edit Profile"}
            </h3>
            {target === "post" && post && (
              <PostEditForm
                postId={post.id}
                currentText={post.text}
                currentImageUrl={post.image}
                closeModal={handleCloseModal}
              />
            )}
            {target === "profile" && user && (
              <UserEditForm
                userId={user.id}
                currentUsername={user.username}
                currentProfilePhoto={user.profilePhoto}
                closeModal={handleCloseModal}
              />
            )}
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
