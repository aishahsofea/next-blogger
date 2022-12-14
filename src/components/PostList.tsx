import Link from "next/link";
import React from "react";

interface Posts {
  id: string;
  title: string;
  content: string;
}

interface Props {
  posts: Posts[];
}

export const PostList = ({ posts }: Props) => {
  return (
    <div>
      {posts.map((post) => (
        <div className="border-b-2 my-5" key={post.id}>
          <h2 className="text-lg font-semibold">
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};
