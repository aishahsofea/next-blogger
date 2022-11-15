import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
import { trpc } from "~/utils/trpc";

interface PostId {
  postId: string;
}

const Post = ({ postId }: PostId) => {
  const post = trpc.post.byId.useQuery({ id: postId });

  return (
    <div className="flex flex-row justify-center items-center">
      {post.isLoading && <div>Loading post for id {postId}</div>}
      {post.isError && <div>There is an error getting the post</div>}
      {post.data && (
        <div className="my-5 p-5 w-8/12">
          <h2 className="text-lg font-semibold ">{post.data.title}</h2>
          <p className="border-dotted border-2 p-3 my-5">{post.data.content}</p>
        </div>
      )}
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: { postId: params?.postId },
    revalidate: 1,
  };
};

export default Post;
