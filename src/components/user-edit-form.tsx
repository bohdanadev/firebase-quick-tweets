"use client";

import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IFormUserProfileData } from "@/types";
import { editProfile } from "@/actions/user-actions";
import { deleteImageInStorage, getImageUrl } from "@/lib/firebase/storage";
import { useUser } from "@/lib/getUser";
import Image from "next/image";

interface IProps {
  userId: string;
  currentUsername: string;
  currentProfilePhoto: string | undefined;
  closeModal: () => void;
}

const UserEditForm: FC<IProps> = ({
  userId,
  currentUsername,
  currentProfilePhoto,
  closeModal,
}) => {
  const { register, handleSubmit } = useForm<IFormUserProfileData>();
  const [imagePreview, setImagePreview] = useState<any>(currentProfilePhoto);
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<IFormUserProfileData> = async (data) => {
    setLoading(true);
    try {
      let updatedFields: { username?: string; profilePhoto?: string | null } =
        {};

      if (data.username) {
        updatedFields.username = data.username;
      }

      if (!data.profilePhoto && !imagePreview && currentProfilePhoto) {
        updatedFields.profilePhoto = null;
      }

      if (data.profilePhoto && data.profilePhoto.length > 0) {
        const imageFile = data.profilePhoto[0];
        const imagePath = `profilePhotos/${userId}/profilePhoto`;
        //   const thumbPath = `profilePhotos/${userId}/thumb_profilePhoto`;
        const imageUrl = await getImageUrl(imagePath, imageFile);
        updatedFields.profilePhoto = imageUrl;
      }
      await editProfile(userId, updatedFields);
      closeModal();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const addProfilePhoto = (e: any) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
      setImagePreview(reader.result);
    };
  };

  const deleteProfilePhoto = async () => {
    setImagePreview(null);
    if (currentProfilePhoto) {
      //   const thumbPath = `profilePhotos/${userId}/thumb_profilePhoto`;
      //  await deleteImageInStorage(currentProfilePhoto, thumbPath);
      await deleteImageInStorage(currentProfilePhoto);
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
        {imagePreview && (
          <div className="relative">
            <Image
              src={imagePreview}
              alt="Current Image"
              width={300}
              height={260}
              className="object-cover"
            />
            <button
              type="button"
              className="btn btn-sm absolute top-2 right-2"
              onClick={deleteProfilePhoto}
            >
              Delete Photo
            </button>
          </div>
        )}
        <input
          type="file"
          {...register("profilePhoto")}
          accept="image/*"
          className="file-input file-input-bordered w-full mt-2"
          onChange={addProfilePhoto}
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
