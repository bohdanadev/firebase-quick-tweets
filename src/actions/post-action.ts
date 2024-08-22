"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  addPost,
  deletePostWithComments,
  getPost,
  likePost,
  unlikePost,
} from "@/lib/firebase/post";
import { addComment } from "@/lib/firebase/comment";

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

  revalidatePath("/posts", "page"); // Update cached posts
}

export async function showPost(postId: string) {
  return await getPost(postId);
}

export async function createComment(
  postId: string,
  comment: string,
  userId: string,
  username: string,
  tag: string,
  userImg: string
) {
  try {
    await addComment(postId, comment, userId, username, tag, userImg);
  } catch (error) {}
  revalidatePath("/posts", "page");
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
