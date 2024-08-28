import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface IAuth {
  username: string;
  profilePhoto: any;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  //  profilePhoto?: string | StaticImport | Blob | MediaSource;
  profilePhoto?: string | StaticImport;
}

export interface IReplyComment extends IComment {
  commentId: string;
}

export interface IComment {
  id: string;
  comment: string;
  postId: string;
  userId: string;
  username: string;
  userImg: string;
  timestamp: any;
  // replies: {
  //   id: string;
  //   commentId: string;
  //   comment: string;
  //   userId: string;
  //   username: string;
  //   userImg: string;
  //   timestamp: any;
  // };
  replies: IReplyComment[];
}

export interface IPost {
  id: string;
  userId: string;
  username: string;
  userImg: string;
  text: string;
  image: string;
  timestamp: any;
  comments: IComment[];
  likes: string[];
  likesCount: number;
  commentsCount: number;
}

export interface IFormData {
  text: string;
  image?: FileList;
}

export interface IFormUserProfileData {
  username: string;
  image?: FileList;
}
