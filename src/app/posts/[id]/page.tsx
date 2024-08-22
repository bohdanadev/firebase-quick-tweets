import { useRouter } from "next/navigation";
import { FC } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import { useAuth } from "@/context/auth-context";
import Sidebar from "@/components/sidebar";
import Post from "@/components/post";
import Modal from "@/components/modal";
import Widgets from "@/components/widgets";
import Comment from "@/components/comment";
import Link from "next/link";
import { getPost } from "@/lib/firebase/post";
import { getComments } from "@/lib/firebase/comment";

interface IProps {
  params: {
    id: string;
  };
}

const PostPage: FC<IProps> = async ({ params: { id } }) => {
  const { user } = useAuth();
  // const [isOpen, setIsOpen] = useState(false);
  // const [post, setPost] = useState<IPost | null>(null);
  // const [comments, setComments] = useState<IComment[]>([]);
  const router = useRouter();

  const post = await getPost(id);
  const comments = await getComments(id);

  // useEffect(
  // () =>
  // onSnapshot(doc(db, "posts", id), (snapshot) => {
  // setPost(snapshot.data() as IPost);
  // }),
  // [id]
  // );
  //
  // useEffect(
  // () =>
  // onSnapshot(
  // query(
  // collection(db, "posts", id, "comments"),
  // orderBy("timestamp", "desc")
  // ),
  // (snapshot) => setComments(snapshot.docs)
  // ),
  // [id]
  // );

  if (!user) router.push("/?mode=login");

  return (
    <div>
      <Head>
        <title>
          {post?.username} on Quick-Tweets: {post?.text}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar />
        <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
          <div className="flex items-center px-1.5 py-2 border-b border-gray-700 text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black">
            <Link
              href="/posts"
              className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
            >
              <ArrowLeftIcon className="h-5 text-white" />
            </Link>
            Tweet
          </div>

          <Post id={id} post={post} />
          {comments.length > 0 && (
            <div className="pb-72">
              {comments.map((comment) => (
                <Comment key={comment.id} id={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>
        <Widgets />

        {/*  {isOpen && <Modal />}  */}
      </main>
    </div>
  );
};

export default PostPage;
