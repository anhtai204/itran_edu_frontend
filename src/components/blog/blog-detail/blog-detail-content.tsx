"use client";
import "katex/dist/katex.min.css";
import katex from "katex";
import { useEffect, useMemo } from "react";
import DOMPurify from "dompurify";


function renderKatex(content: string) {
  if (typeof document !== "undefined") {
    // Loại bỏ dấu " bao quanh chuỗi nếu có (do escaping từ backend)
    let cleanedContent = content;
    if (cleanedContent.startsWith('"') && cleanedContent.endsWith('"')) {
      cleanedContent = cleanedContent.slice(1, -1); // Bỏ dấu " đầu và cuối
    }

    // Thay thế các ký tự escaped không mong muốn
    cleanedContent = cleanedContent
      .replace(/\\"/g, '"') // Thay \" thành "
      .replace(/\\+/g, "\\"); // Thay \\ thành \

    const div = document.createElement("div");
    div.innerHTML = cleanedContent;

    const katexElements = div.querySelectorAll("[data-formula]");
    katexElements.forEach((el) => {
      const tex = el.getAttribute("data-formula") || "";
      const displayMode = el.getAttribute("data-display-mode") === "true";
      el.innerHTML = katex.renderToString(tex, {
        displayMode,
        throwOnError: false,
        strict: "ignore",
      });
    });
    return div.innerHTML;
  }
  return content;
}

const BlogDetailContent = (props: { content: string }) => {
  const { content } = props;

  const sanitizedContent = useMemo(() => {
    // Ensure DOMPurify works in client-side only
    if (typeof window !== "undefined") {
      return DOMPurify.sanitize(renderKatex(content));
    }
    return content; // Return raw content as fallback for SSR
  }, [content]);

  return (
    <div
      className="prose prose-gray dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default BlogDetailContent;
