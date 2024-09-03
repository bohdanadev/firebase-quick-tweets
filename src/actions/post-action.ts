"use server";

import { revalidatePath } from "next/cache";
import {
  addPost,
  deletePostWithComments,
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

export async function createPost(
  userId: string,
  username: string,
  profilePhoto: string,
  input: string,
  selectedFile: any
) {
  try {
    await addPost(userId, username, profilePhoto, input, selectedFile);
    revalidatePath("/posts", "page");
  } catch (error) {
    throw new Error("Create post failed");
  }
}

export async function createComment(
  postId: string,
  comment: string,
  userId: string,
  username: string,
  userImg: any
) {
  try {
    const newComment = await addComment(
      postId,
      comment,
      userId,
      username,
      userImg
    );
    return newComment;
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
    const newReply = await addReplyToComment(
      postId,
      commentId,
      comment,
      userId,
      username,
      userImg
    );
    return newReply;
  } catch (error) {
    throw new Error("Failed create comment reply");
  }
}

export async function editPost(
  postId: string,
  updatedFields: { text?: string; image?: string | null }
) {
  try {
    await updatePost(postId, updatedFields);

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
    revalidatePath("/posts", "page");
    revalidatePath(`/posts/${postId}`, "page");
  } catch (error) {
    throw new Error("Failed delete post");
  }
}

export async function deleteComment(postId: string, commentId: string) {
  try {
    await deleteCommentWithReplies(postId, commentId);
    revalidatePath("/posts", "page");
    revalidatePath(`/posts/${postId}`, "page");
  } catch (error) {
    throw new Error("Failed delete comment");
  }
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
