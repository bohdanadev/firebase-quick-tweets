interface IUser {
  id: string;
  username: string;
  email: string;
  profilePhoto: string;
  tag: string;
}

interface IPost {
  id: string;
  username: string;
  userImg: string;
  tag: string;
  text: string;
  image: string;
  timestamp: ServerTimestamp;
  comments: Icomment[];
  likes?: Pick<IUser, "id">[];
  isLiked?: boolean;
}

interface IComment {
  comment: string;
  username: string;
  tag: string;
  userImg: string;
  timestamp: ServerTimestamp;
}
