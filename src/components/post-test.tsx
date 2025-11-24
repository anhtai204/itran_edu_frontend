"use client";

import { useState } from "react";
import Tiptap from "./tiptap";

const PostEditorTest = () => {
  const [post, setPost] = useState("");

  const onChange = (content: string) => {
    console.log('>>>content: ', content);
    setPost(content);
  }

  return (
    <>
      <Tiptap content={post} onChange={onChange}/>
    </>
  );
};

export default PostEditorTest;
