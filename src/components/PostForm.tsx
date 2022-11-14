import React, { useRef, useState } from "react";
import { trpc } from "~/utils/trpc";

export const PostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const utils = trpc.useContext();
  const addPost = trpc.post.add.useMutation({
    async onSuccess() {
      await utils.post.list.invalidate;
    },
  });

  const handleAddPost = async () => {
    try {
      await addPost.mutate({
        title: title,
        content: content,
      });
    } catch (error) {
      console.error({ error }, "Failed to add a post");
    }
  };

  return (
    <div className="pt-10 flex flex-col">
      <form className="flex flex-col">
        <div className="flex">
          <label className="pr-2">Title:</label>
          <input
            type="text"
            name="title"
            className="w-full rounded-lg border-2"
            placeholder="The title for your blog post"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>
        <br />

        <label>Content:</label>
        <div className="w-full">
          <textarea
            name="content"
            className="w-full rounded-lg border-2"
            placeholder="The content of your blog post"
            onChange={(e) => setContent(e.target.value)}
            value={content}
          ></textarea>
        </div>

        <button
          type="submit"
          className="p-2 mt-2 bg-orange-600 text-slate-200 rounded-sm"
          onClick={handleAddPost}
          disabled={!title || !content}
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
};
