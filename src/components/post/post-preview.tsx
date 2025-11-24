"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import "katex/dist/katex.min.css";
import katex from "katex";
import DOMPurify from "dompurify";

interface Block {
  id: string;
  type: string;
  content: string;
}

// Update the PostPreviewProps interface to include the new props
interface PostPreviewProps {
  title?: string;
  description?: string;
  excerpt?: string;
  blocks: Block[];
  featuredImage?: string;
  allowComments?: boolean;
  receiveNotifications?: boolean;
}

// Update the function parameters to include the new props
export function PostPreview({
  title,
  description,
  excerpt,
  blocks,
  featuredImage,
  allowComments = true,
  receiveNotifications = true,
}: PostPreviewProps) {
  const [mounted, setMounted] = useState(false);


  console.log("PostPreview props:", {
    title,
    description,
    excerpt,
    blocks,
    featuredImage,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-4">Loading preview...</div>;
  }

  // Use excerpt if available, otherwise fall back to description
  const displayExcerpt = excerpt || description;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Social Media Preview Card */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-2">Social Media Preview</h2>
        <Card className="overflow-hidden border shadow-md">
          <CardContent className="p-0">
            <div>
              {featuredImage ? (
                <div className="aspect-[1200/630] w-full overflow-hidden bg-muted">
                  <img
                    // src={
                    //   typeof featuredImage === "string" &&
                    //   featuredImage.startsWith("blob:")
                    //     ? featuredImage
                    //     : `${process.env.NEXT_PUBLIC_BACKEND_URL}/${featuredImage}`
                    // }
                    src={featuredImage}
                    alt={title || "Featured image"}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.alt = "Cannot show image";
                    }}
                  />
                </div>
              ) : (
                <div className="aspect-[1200/630] w-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">
                    Featured image preview
                  </span>
                </div>
              )}
              <div className="p-4 space-y-2">
                <h3 className="text-xl font-semibold line-clamp-2">
                  {title || "Untitled Post"}
                </h3>
                {displayExcerpt && (
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {displayExcerpt}
                  </p>
                )}
                <div className="text-xs text-muted-foreground">
                  yourdomain.com
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Article Preview */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-medium mb-4">Article Preview</h2>

        {/* Featured Image */}
        {featuredImage && (
          <div className="rounded-lg overflow-hidden mb-6">
            <img
              // src={
              //   typeof featuredImage === "string" &&
              //   featuredImage.startsWith("blob:")
              //     ? featuredImage
              //     : `${process.env.NEXT_PUBLIC_BACKEND_URL}/${featuredImage}`
              // }
              src={featuredImage}
              alt={title || "Featured image"}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.alt = "Cannot show image";
              }}
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold mb-3">{title || "Untitled Post"}</h1>

        {/* Excerpt (if available) */}
        {excerpt && (
          <div className="mb-6 italic border-l-4 border-muted pl-4 py-2">
            <p className="text-lg">{excerpt}</p>
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-lg text-muted-foreground mb-6">{description}</p>
        )}

        {/* Content Blocks */}
        <div className="space-y-6">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="prose prose-stone dark:prose-invert max-w-none"
            >
              {renderBlockPreview(block)}
            </div>
          ))}
        </div>
      </div>
      {/* Post Settings Info */}
      <div className="mt-8 pt-4 border-t text-sm text-muted-foreground">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                allowComments ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span>
              {allowComments
                ? "Comments are enabled for this post"
                : "Comments are disabled for this post"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                receiveNotifications ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
            <span>
              {receiveNotifications
                ? "You will receive notifications about this post"
                : "Notifications are disabled for this post"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderBlockPreview(block: Block) {
  switch (block.type) {
    case "text":
      return (
        <div
          dangerouslySetInnerHTML={{
            __html:
              DOMPurify.sanitize(renderKatex(block.content)) ||
              "<p>Empty text block</p>",
          }}
        />
      );
    case "image":
      return block.content ? (
        <figure className="my-4">
          <img
            src={block.content || "/placeholder.svg"}
            alt="Content"
            className="rounded-md max-h-[400px] object-contain mx-auto"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=300&width=600";
            }}
          />
        </figure>
      ) : (
        <div className="my-4 p-4 border border-dashed rounded-md flex items-center justify-center bg-muted h-[200px]">
          <span className="text-muted-foreground">Image placeholder</span>
        </div>
      );
    case "code":
      return (
        <Card className="my-4 bg-muted">
          <CardContent className="p-4">
            <pre className="overflow-x-auto">
              <code>{block.content || "// Code example"}</code>
            </pre>
          </CardContent>
        </Card>
      );
    case "video":
      if (
        block.content &&
        (block.content.includes("youtube.com") ||
          block.content.includes("youtu.be"))
      ) {
        // Extract YouTube video ID
        const videoId = block.content.includes("youtu.be")
          ? block.content.split("/").pop()
          : block.content.split("v=")[1]?.split("&")[0];

        return (
          <div className="aspect-video my-4">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-md"
            ></iframe>
          </div>
        );
      } else if (
        block.content &&
        (block.content.startsWith("blob:") || block.content.startsWith("http"))
      ) {
        return (
          <video
            controls
            className="w-full rounded-md my-4"
            src={block.content}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        );
      } else {
        return (
          <div className="my-4 p-4 border border-dashed rounded-md flex items-center justify-center bg-muted aspect-video">
            <span className="text-muted-foreground">Video placeholder</span>
          </div>
        );
      }
    case "math":
      return (
        <div
          className="my-4"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              katex.renderToString(block.content || "Empty formula", {
                throwOnError: false,
              })
            ),
          }}
        />
      );
    default:
      return <p>{block.content || "Empty block"}</p>;
  }
}

// Helper function to render KaTeX formulas
function renderKatex(content: string) {
  const div = document.createElement("div");
  div.innerHTML = content;
  const katexElements = div.querySelectorAll("[data-formula]");
  katexElements.forEach((el) => {
    const tex = el.getAttribute("data-formula") || "";
    const displayMode = el.getAttribute("data-display-mode") === "true";
    el.innerHTML = katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
    });
  });
  return div.innerHTML;
}

// "use client"

// interface Block {
//   id: string
//   type: string
//   content: string
//   listType?: string
// }

// interface PostPreviewProps {
//   title?: string
//   description?: string
//   excerpt?: string
//   blocks: Block[]
//   featuredImage?: string
//   allowComments?: boolean
//   receiveNotifications?: boolean
// }

// export function PostPreview({
//   title,
//   description,
//   excerpt,
//   blocks,
//   featuredImage,
//   allowComments,
//   receiveNotifications,
// }: PostPreviewProps) {
//   return (
//     <div className="max-w-3xl mx-auto space-y-6 py-4">
//       {/* Featured Image */}
//       {featuredImage && (
//         <div className="rounded-lg overflow-hidden">
//           <img
//             src={featuredImage || "/placeholder.svg"}
//             alt={title || "Featured image"}
//             className="w-full h-auto max-h-[400px] object-cover"
//             onError={(e) => {
//               e.currentTarget.src = "/placeholder.svg?height=400&width=800"
//             }}
//           />
//         </div>
//       )}

//       {/* Title */}
//       <h1 className="text-3xl font-bold">{title || "Untitled Post"}</h1>

//       {/* Description */}
//       {description && <p className="text-lg text-muted-foreground">{description}</p>}

//       {/* Excerpt */}
//       {excerpt && excerpt !== description && (
//         <div className="bg-muted/50 p-4 rounded-md">
//           <h3 className="text-sm font-medium mb-1">Excerpt:</h3>
//           <p className="text-sm italic">{excerpt}</p>
//         </div>
//       )}

//       {/* Content Blocks */}
//       <div className="space-y-6 mt-8">
//         {blocks.map((block) => (
//           <div key={block.id} className="prose prose-stone dark:prose-invert max-w-none">
//             {renderBlockPreview(block)}
//           </div>
//         ))}
//       </div>

//       {/* Post Settings */}
//       <div className="border-t pt-4 mt-8 text-sm text-muted-foreground">
//         <div className="flex flex-wrap gap-4">
//           <div>
//             <span className="font-medium">Comments:</span> {allowComments ? "Enabled" : "Disabled"}
//           </div>
//           <div>
//             <span className="font-medium">Notifications:</span> {receiveNotifications ? "Enabled" : "Disabled"}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// function renderBlockPreview(block: Block) {
//   switch (block.type) {
//     case "text":
//       return (
//         <div
//           dangerouslySetInnerHTML={{
//             __html: block.content || "<p>Empty text block</p>",
//           }}
//         />
//       )
//     case "image":
//       return (
//         <figure className="my-4">
//           <img
//             src={block.content || "/placeholder.svg?height=300&width=600"}
//             alt="Content"
//             className="rounded-md max-h-[400px] object-contain mx-auto"
//             onError={(e) => {
//               e.currentTarget.src = "/placeholder.svg?height=300&width=600"
//             }}
//           />
//         </figure>
//       )
//     case "video":
//       if (block.content) {
//         if (block.content.includes("youtube.com") || block.content.includes("youtu.be")) {
//           // Extract YouTube video ID
//           const videoId = block.content.includes("youtu.be")
//             ? block.content.split("/").pop()
//             : block.content.split("v=")[1]?.split("&")[0]

//           return (
//             <div className="aspect-video">
//               <iframe
//                 width="100%"
//                 height="100%"
//                 src={`https://www.youtube.com/embed/${videoId}`}
//                 title="YouTube video player"
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//                 className="rounded-md"
//               ></iframe>
//             </div>
//           )
//         } else {
//           return (
//             <video
//               controls
//               className="w-full rounded-md"
//               src={block.content}
//               onError={(e) => {
//                 e.currentTarget.style.display = "none"
//               }}
//             />
//           )
//         }
//       }
//       return <p className="text-muted-foreground">No video selected</p>
//     case "code":
//       return (
//         <pre className="bg-muted p-4 rounded-md overflow-x-auto">
//           <code>{block.content || "// Empty code block"}</code>
//         </pre>
//       )
//     case "list":
//       if (block.listType === "bullet" || !block.listType) {
//         return (
//           <ul className="list-disc pl-6">
//             {(block.content || "").split("\n").map((item, index) => (
//               <li key={index}>{item.replace(/^-\s*/, "")}</li>
//             ))}
//           </ul>
//         )
//       } else {
//         return (
//           <ol className="list-decimal pl-6">
//             {(block.content || "").split("\n").map((item, index) => (
//               <li key={index}>{item.replace(/^\d+\.\s*/, "")}</li>
//             ))}
//           </ol>
//         )
//       }
//     default:
//       return <p>{block.content || "Empty block"}</p>
//   }
// }
