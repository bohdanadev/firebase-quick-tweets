import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface IAuth {
  username: string;
  profilePhoto: any;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  profilePhoto?: string | StaticImport | Blob | MediaSource;
}

export interface IComment {
  id: string;
  comment: string;
  userId: string;
  username: string;
  userImg: string;
  timestamp: any;
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
}
