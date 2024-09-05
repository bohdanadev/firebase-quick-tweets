"use client";

import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IFormData } from "@/types";
import { editPost } from "@/actions/post-action";
import { XMarkIcon } from "@heroicons/react/24/outline";
import PickerComponent from "./emoji-picker";
import { deleteImageInStorage, getImageUrl } from "@/lib/firebase/storage";
import Image from "next/image";

interface IPostEditFormProps {
  postId: string;
  currentText?: string;
  currentImageUrl?: string | undefined;
  closeModal: () => void;
}

const PostEditForm: FC<IPostEditFormProps> = ({
  postId,
  currentText,
  currentImageUrl,
  closeModal,
}) => {
  const { register, handleSubmit, setValue, getValues } = useForm<IFormData>();
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState<any>(currentImageUrl);

  const deleteImage = async () => {
    setImagePreview(null);
    if (currentImageUrl) {
      //   const thumbPath = `posts/${postId}/thumb_image`;
      //  await deleteImageInStorage(currentImageUrl, thumbPath);
      await deleteImageInStorage(currentImageUrl);
    }
  };

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    setLoading(true);
    try {
      let updatedFields: { text?: string; image?: string | null } = {};

      if (data.text && data.text !== currentText) {
        updatedFields.text = data.text;
      }

      //  if (!data.image && !imagePreview && currentImageUrl) {
      //    //   const thumbPath = `posts/${postId}/thumb_image`;
      //    //  await deleteImageInStorage(currentImageUrl, thumbPath);
      //
      //    updatedFields.image = null;
      //  }
      //
      //  if (data.image && data.image.length > 0) {
      //    const imageFile = data.image[0];
      //    const imagePath = `posts/${postId}/image`;
      //    //   const thumbPath = `posts/${postId}/thumb_image`;
      //    //   const imageUrl = await getImageUrl(imagePath, imageFile, thumbPath);
      //    const imageUrl = await getImageUrl(imagePath, imageFile);
      //    updatedFields.image = imageUrl;
      //  }

      if (data.image && data.image.length > 0) {
        const imageFile = data.image[0];
        const imagePath = `posts/${postId}/image`;
        const imageUrl = await getImageUrl(imagePath, imageFile);
        updatedFields.image = imageUrl;
      } else if (!data.image && imagePreview === null && currentImageUrl) {
        updatedFields.image = null;
      } else if (!data.image && currentImageUrl && imagePreview) {
        updatedFields.image = currentImageUrl;
      }
      await editPost(postId, updatedFields);

      closeModal();
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const addEmoji = (e: any) => {
    let sym = e.unified.split("-");
    let codesArray: any = [];
    sym.forEach((el: string) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    const currentValue = getValues("text");
    const newValue = currentValue + emoji;

    setValue("text", newValue, {
      shouldValidate: true,
    });
  };

  const addImage = (e: any) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
      setImagePreview(reader.result);
    };
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-control">
        <textarea
          defaultValue={currentText}
          {...register("text", { required: true })}
          className="textarea textarea-bordered w-full"
          placeholder="What's on your mind?"
        />
        <div className="flex justify-between items-center mt-2">
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            😊 Add Emoji
          </button>
          {showEmojiPicker && <PickerComponent onEmojiSelect={addEmoji} />}
        </div>
      </div>

      <div className="form-control">
        {imagePreview && (
          <div className="relative">
            <Image
              src={imagePreview}
              alt="Current Image"
              width={300}
              height={256}
              className="w-full h-64 object-cover"
            />
            <button
              type="button"
              className="btn btn-sm absolute top-2 right-2"
              onClick={deleteImage}
            >
              <XMarkIcon className="text-red-500 h-[22px] color-red-500" />
            </button>
          </div>
        )}
        <input
          type="file"
          {...register("image")}
          accept="image/*"
          className="file-input file-input-bordered w-full mt-2"
          onChange={addImage}
        />
      </div>

      <div className="form-control">
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Post"}
        </button>
      </div>
    </form>
  );
};

export default PostEditForm;
