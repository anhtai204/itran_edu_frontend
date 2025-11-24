"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menu-bar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Katex } from "./tiptap-extensions/katex-extension";
import { MathToolbar } from "./math-toolbar";
import "katex/dist/katex.min.css";
import { Button } from "./ui/button";
import { useState, useRef } from "react";

// interface TiptapProps {
//   content: string;
//   onChange: (content: string) => void;
// }

// export default function Tiptap({ content, onChange }: TiptapProps) {
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({
//         bulletList: {
//           HTMLAttributes: {
//             class: "list-disc ml-3",
//           },
//         },
//         orderedList: {
//           HTMLAttributes: {
//             class: "list-decimal ml-3",
//           },
//         },
//         paragraph: {
//           HTMLAttributes: {
//             class: "mb-4 whitespace-pre-wrap",
//           },
//         },
//       }),
//       TextAlign.configure({
//         types: ["heading", "paragraph"],
//       }),
//       Highlight,
//       Underline,
//       Link.configure({
//         openOnClick: false,
//       }),
//       Image,
//       Katex,
//     ],
//     content: content,
//     editorProps: {
//       attributes: {
//         class:
//           "min-h-[156px] border rounded-md bg-slate-50 py-2 px-3 dark:bg-gray-700 dark:text-white",
//       },
//     },
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML());
//     },
//     // Set immediatelyRender to false to avoid hydration mismatches
//     immediatelyRender: false,
//   });

//   return (
//     <div>
//       <MenuBar editor={editor} />
//       <MathToolbar editor={editor} />
//       <EditorContent editor={editor} />
//     </div>
//   );
// }

interface TiptapProps {
  content: string
  onChange: (content: string) => void
  showMathToolbar: boolean
  setShowMathToolbar: (show: boolean) => void
}

export default function Tiptap({ content, onChange, showMathToolbar, setShowMathToolbar }: TiptapProps) {
  const [showMenuBar, setShowMenuBar] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: "mb-4 whitespace-pre-wrap",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Katex,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "min-h-[156px] border rounded-md bg-slate-50 py-2 px-3 dark:bg-gray-700 dark:text-white",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    immediatelyRender: false,
  })

  // Xử lý focus/blur trên wrapper
  const handleFocus = () => setShowMenuBar(true);
  const handleBlur = (e: React.FocusEvent) => {
    // Nếu blur sang phần tử nằm ngoài wrapper thì mới ẩn
    if (
      e.relatedTarget &&
      wrapperRef.current?.contains(e.relatedTarget as Node)
    ) {
      return;
    }
    setShowMenuBar(false);
  };

  return (
    <div
      ref={wrapperRef}
      tabIndex={-1}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={{ outline: "none" }}
    >
      {showMenuBar && <MenuBar editor={editor} />}
      <div className="flex items-center justify-between">
        <Button className="rounded-sm hover:bg-gray-300" variant="ghost" size="sm" onClick={() => setShowMathToolbar(!showMathToolbar)}>
          Toggle Math Toolbar
        </Button>
      </div>
      {showMathToolbar && <MathToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}

