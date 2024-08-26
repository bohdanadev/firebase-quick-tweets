"use server";

import { revalidatePath } from "next/cache";
import {
  addPost,
  deletePostWithComments,
  likePost,
  unlikePost,
  updatePost,
} from "@/lib/firebase/post";
import { addComment } from "@/lib/firebase/comment";
import { IFormData } from "@/types";

export async function createPost(
  userId: string,
  username: string,
  profilePhoto: string,

  input: string,
  selectedFile: string | ArrayBuffer | null
) {
  try {
    await addPost(userId, username, profilePhoto, input, selectedFile);
  } catch (error) {
    // Handle errors
  }

  revalidatePath("/posts", "page");
}

export async function createComment(
  postId: string,
  comment: string,
  userId: string,
  username: string,
  userImg: any
) {
  try {
    await addComment(postId, comment, userId, username, userImg);
    revalidatePath("/posts", "page");
  } catch (error) {
    throw new Error("Failed create post");
  }
}

export async function editPost(
  postId: string,
  data: IFormData,
  currentText: string,
  currentImageUrl: string
) {
  try {
    await updatePost(postId, data, currentText, currentImageUrl);
    revalidatePath(`/posts/${postId}`, "page");
    revalidatePath("/posts", "page");
  } catch (error) {
    throw new Error("Failed edit post");
  }
}

export async function deletePost(postId: string) {
  try {
    await deletePostWithComments(postId);
  } catch (error) {}
  revalidatePath("/posts", "page");
}

export async function likePostAction(postId: string, userId: string) {
  await likePost(postId, userId);
  revalidatePath("/posts", "page");
}

export async function unlikePostAction(postId: string, userId: string) {
  await unlikePost(postId, userId);
  revalidatePath("/posts", "page");
}
