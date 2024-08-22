import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface IUser {
  id: string;
  username: string;
  email: string;
  profilePhoto?: string | StaticImport;
}

export interface IComment {
  comment: string;
  userId: string;
  username: string;
  tag: string;
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
