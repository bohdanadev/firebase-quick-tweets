"use client";

import { FC, useState } from "react";
import { updateDoc, doc, deleteField } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase/firebase";
import { SubmitHandler, useForm } from "react-hook-form";
import { IFormData, IFormUserProfileData } from "@/types";
import { editProfile } from "@/actions/user-actions";

interface IProps {
  userId: string;
  currentUsername: string;
  currentProfilePhoto: string;
  closeModal: () => void;
}

const UserEditForm: FC<IProps> = ({
  userId,
  currentUsername,
  currentProfilePhoto,
  closeModal,
}) => {
  const { register, handleSubmit, setValue, getValues } =
    useForm<IFormUserProfileData>();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<IFormUserProfileData> = async (data) => {
    setLoading(true);
    try {
      await editProfile(userId, data, currentProfilePhoto);
      // const userRef = doc(db, "users", userId);
      // let updatedFields: { username?: string; profilePhoto?: string | null } =
      //   {};

      // if (data.username) {
      //   updatedFields.username = data.username;
      // }

      // if (data.image && data.image.length > 0) {
      //   const imageFile = data.image[0];
      //   const imageRef = ref(
      //     storage,
      //     `profilePhotos/${userId}/${imageFile.name}`
      //   );
      //   await uploadBytes(imageRef, imageFile);
      //   const imageUrl = await getDownloadURL(imageRef);
      //   updatedFields.profilePhoto = imageUrl;
      // }

      // if (currentProfilePhoto && !data.image) {
      //   const imageRef = ref(storage, currentProfilePhoto);
      //   await deleteObject(imageRef);
      //   updatedFields.profilePhoto = deleteField();
      // }

      // await updateDoc(userRef, updatedFields);
      closeModal();
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-control">
        <textarea
          defaultValue={currentUsername}
          {...register("username", { required: true })}
          className="textarea textarea-bordered w-full"
        />
      </div>

      <div className="form-control">
        {currentProfilePhoto && (
          <div className="relative">
            <img
              src={currentProfilePhoto}
              alt="Current Image"
              className="w-full h-64 object-cover"
            />
            <button
              type="button"
              className="btn btn-sm absolute top-2 right-2"
              onClick={() => setValue("image", undefined)}
            >
              Delete Photo
            </button>
          </div>
        )}
        <input
          type="file"
          {...register("image")}
          accept="image/*"
          className="file-input file-input-bordered w-full mt-2"
        />
      </div>

      <div className="form-control">
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </form>
  );
};

export default UserEditForm;
