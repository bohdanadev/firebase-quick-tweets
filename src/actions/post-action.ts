"use server";

import { revalidatePath } from "next/cache";
import {
  addPost,
  deletePostWithComments,
  getPost,
  likePost,
  unlikePost,
  updatePost,
} from "@/lib/firebase/post";
import {
  addComment,
  addReplyToComment,
  deleteCommentWithReplies,
  updateComment,
} from "@/lib/firebase/comment";
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
    throw new Error("Create post failed");
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
    revalidatePath(`/posts/${postId}`, "page");
  } catch (error) {
    throw new Error("Failed create comment");
  }
}

export async function createReplyComment(
  postId: string,
  commentId: string,
  comment: string,
  userId: string,
  username: string,
  userImg: any
) {
  try {
    await addReplyToComment(
      postId,
      commentId,
      comment,
      userId,
      username,
      userImg
    );
    revalidatePath("/posts", "page");
    revalidatePath(`/posts/${postId}`, "page");
  } catch (error) {
    throw new Error("Failed create comment");
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

export async function editComment(
  postId: string,
  commentId: string,
  text: string
) {
  try {
    await updateComment(postId, commentId, text);
    revalidatePath(`/posts/${postId}`, "page");
    revalidatePath("/posts", "page");
  } catch (error) {
    throw new Error("Failed edit comment");
  }
}

export async function deletePost(postId: string) {
  try {
    await deletePostWithComments(postId);
  } catch (error) {}
  revalidatePath("/posts", "page");
  revalidatePath(`/posts/${postId}`, "page");
}

export async function deleteComment(postId: string, commentId: string) {
  try {
    await deleteCommentWithReplies(postId, commentId);
  } catch (error) {
    throw new Error("Failed delete comment");
  }
  revalidatePath("/posts", "page");
  revalidatePath(`/posts/${postId}`, "page");
}

export async function likePostAction(postId: string, userId: string) {
  await likePost(postId, userId);
  revalidatePath("/posts", "page");
  revalidatePath(`/posts/${postId}`, "page");
}

export async function unlikePostAction(postId: string, userId: string) {
  await unlikePost(postId, userId);
  revalidatePath("/posts", "page");
  revalidatePath(`/posts/${postId}`, "page");
}
