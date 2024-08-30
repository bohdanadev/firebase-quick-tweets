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
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { IFormData } from "@/types";
import { editPost } from "@/actions/post-action";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface IPostEditFormProps {
  postId: string;
  currentText: string;
  currentImageUrl: string;
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

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    setLoading(true);
    try {
      await editPost(postId, data, currentText, currentImageUrl);
      //    const postRef = doc(db, "posts", postId);
      //    let updatedFields: { text?: string; imageUrl?: string | null } = {};

      //    if (data.text) {
      //      updatedFields.text = data.text;
      //    }

      //    if (data.image && data.image.length > 0) {
      //      const imageFile = data.image[0];
      //      const imageRef = ref(storage, `posts/${postId}/${imageFile.name}`);
      //      await uploadBytes(imageRef, imageFile);
      //      const imageUrl = await getDownloadURL(imageRef);
      //      updatedFields.imageUrl = imageUrl;
      //    }

      //    if (currentImageUrl && !data.image) {
      //      const imageRef = ref(storage, currentImageUrl);
      //      await deleteObject(imageRef);
      //      updatedFields.imageUrl = deleteField();
      //    }

      //    await updateDoc(postRef, updatedFields);
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
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    const currentValue = getValues("text");
    const newValue = currentValue + emoji;

    setValue("text", newValue, {
      shouldValidate: true,
    });
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
          {showEmojiPicker && (
            <Picker
              data={data}
              onEmojiSelect={addEmoji}
              style={{
                position: "absolute",
                marginTop: "465px",
                marginLeft: -40,
                maxWidth: "320px",
                borderRadius: "20px",
              }}
              theme="dark"
            />
          )}
        </div>
      </div>

      <div className="form-control">
        {currentImageUrl && (
          <div className="relative">
            <Image
              src={currentImageUrl}
              alt="Current Image"
              width={300}
              height={256}
              className="w-full h-64 object-cover"
            />
            <button
              type="button"
              className="btn btn-sm absolute top-2 right-2"
              onClick={() => setValue("image", undefined)}
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
