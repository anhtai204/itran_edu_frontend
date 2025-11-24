"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  GripVertical,
  Type,
  Image,
  Code,
  Video,
  List,
  Trash2,
  Eye,
  Edit2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FileUploadArea } from "./file-upload-area";
import Tiptap from "../tiptap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsPreview } from "./news-preview";

type BlockType = "text" | "image" | "code" | "video" | "list";

export interface Block {
  id: string;
  type: BlockType;
  content: string | File;
  previewUrl?: string;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const initialBlocks: Block[] = [
  {
    id: generateId(),
    type: "text",
    content: "<p></p>",
  },
];

export function NewsEditor({
  title = "",
  description = "",
  excerpt = "",
  featuredImage = "",
  blocks: externalBlocks,
  setBlocks: setExternalBlocks,
  onBlocksChange,
}: {
  title?: string;
  description?: string;
  excerpt?: string;
  featuredImage?: string;
  blocks?: Block[];
  setBlocks?: React.Dispatch<React.SetStateAction<Block[]>>;
  onBlocksChange?: (blocks: Block[]) => void;
} = {}) {
  const [internalBlocks, setInternalBlocks] = useState<Block[]>(initialBlocks);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("edit");
  const [showMathToolbar, setShowMathToolbar] = useState(true);

  const isExternalBlocks =
    externalBlocks !== undefined && setExternalBlocks !== undefined;
  const blocks = isExternalBlocks ? externalBlocks : internalBlocks;

  const updateBlocks = useCallback(
    (newBlocks: Block[] | ((prevBlocks: Block[]) => Block[])) => {
      if (isExternalBlocks) {
        setExternalBlocks(newBlocks);
      } else {
        setInternalBlocks(newBlocks);
      }
      if (onBlocksChange) {
        if (typeof newBlocks === "function") {
          const updatedBlocks = newBlocks(blocks);
          onBlocksChange(updatedBlocks);
        } else {
          onBlocksChange(newBlocks);
        }
      }
    },
    [blocks, isExternalBlocks, onBlocksChange, setExternalBlocks]
  );

  useEffect(() => {
    if (externalBlocks && externalBlocks.length > 0 && !isExternalBlocks) {
      setInternalBlocks(externalBlocks);
    }
  }, [externalBlocks, isExternalBlocks]);

  const handleDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return;
      const items = Array.from(blocks);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      updateBlocks(items);
    },
    [blocks, updateBlocks]
  );

  const addBlock = useCallback(
    (type: BlockType) => {
      const newBlock: Block = {
        id: generateId(),
        type,
        content: type === "text" ? "<p></p>" : "",
      };
      updateBlocks((prevBlocks) => [...prevBlocks, newBlock]);
      setTimeout(() => {
        setActiveBlockId(newBlock.id);
      }, 100);
    },
    [updateBlocks]
  );

  const updateBlockContent = useCallback(
    (id: string, content: string | File, previewUrl: string = "") => {
      updateBlocks((prevBlocks) =>
        prevBlocks.map((block) =>
          block.id === id ? { ...block, content, previewUrl } : block
        )
      );
    },
    [updateBlocks]
  );

  const deleteBlock = useCallback(
    (id: string) => {
      updateBlocks((prevBlocks) =>
        prevBlocks.filter((block) => block.id !== id)
      );
    },
    [updateBlocks]
  );

  const handleFileSelect = useCallback(
    (id: string, file: File | null) => {
      if (file) {
        const blobUrl = URL.createObjectURL(file);
        updateBlockContent(id, file, blobUrl); // Lưu cả File và blob URL
      } else {
        updateBlockContent(id, "", ""); // Xóa nội dung nếu file là null
      }
    },
    [updateBlockContent]
  );

  const handleFileUpload = useCallback(
    (id: string, url: string) => {
      updateBlockContent(id, url);
    },
    [updateBlockContent]
  );

  // Hàm chuyển đổi blocks cho preview
  const getPreviewBlocks = useCallback(() => {
    return blocks.map((block) => ({
      ...block,
      content:
        block.content instanceof File
          ? URL.createObjectURL(block.content)
          : (block.content as string),
    }));
  }, [blocks]);

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addBlock("text")}
              className="flex items-center gap-1"
            >
              <Type className="h-4 w-4" />
              Text
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addBlock("image")}
              className="flex items-center gap-1"
            >
              <Image className="h-4 w-4" />
              Image
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addBlock("code")}
              className="flex items-center gap-1"
            >
              <Code className="h-4 w-4" />
              Code
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addBlock("video")}
              className="flex items-center gap-1"
            >
              <Video className="h-4 w-4" />
              Video
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addBlock("list")}
              className="flex items-center gap-1"
            >
              <List className="h-4 w-4" />
              List
            </Button>
          </div>

          <TabsList>
            <TabsTrigger value="edit" className="flex items-center gap-1">
              <Edit2 className="h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="blocks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {blocks.map((block, index) => (
                    <Draggable
                      key={block.id}
                      draggableId={block.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            "border rounded-md p-3 bg-background",
                            snapshot.isDragging ? "opacity-70" : "",
                            activeBlockId === block.id
                              ? "ring-2 ring-primary"
                              : ""
                          )}
                          onClick={() => setActiveBlockId(block.id)}
                        >
                          <div className="flex items-start gap-2">
                            <div
                              {...provided.dragHandleProps}
                              className="mt-2 cursor-grab"
                            >
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              {renderBlockContent(
                                block,
                                updateBlockContent,
                                (file) => handleFileSelect(block.id, file),
                                (url) => handleFileUpload(block.id, url),
                                showMathToolbar,
                                setShowMathToolbar
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteBlock(block.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Button
            variant="outline"
            className="w-full mt-4 border-dashed"
            onClick={() => addBlock("text")}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Block
          </Button>
        </TabsContent>

        <TabsContent value="preview">
          <NewsPreview
            title={title}
            description={description}
            excerpt={excerpt}
            blocks={getPreviewBlocks()} // Truyền blocks đã chuyển đổi
            featuredImage={featuredImage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function renderBlockContent(
  block: Block,
  updateContent: (id: string, content: string | File) => void,
  onFileSelect: (file: File) => void,
  onFileUpload: (url: string) => void,
  showMathToolbar: boolean,
  setShowMathToolbar: (show: boolean) => void
) {
  switch (block.type) {
    case "text":
      return (
        <Tiptap
          content={block.content as string}
          onChange={(content) => updateContent(block.id, content)}
          showMathToolbar={showMathToolbar}
          setShowMathToolbar={setShowMathToolbar}
        />
      );
    case "image":
      return (
        <div className="space-y-2">
          <Input
            value={typeof block.content === "string" ? block.content : ""}
            onChange={(e) => updateContent(block.id, e.target.value)}
            placeholder="Enter image URL or upload"
          />
          {block.content && (
            <div className="mt-2 rounded-md overflow-hidden">
              <img
                src={
                  block.content instanceof File
                    ? URL.createObjectURL(block.content)
                    : block.content
                }
                alt="Content"
                className="max-h-[200px] object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=200&width=400";
                }}
              />
            </div>
          )}
          <FileUploadArea
            onFileSelect={onFileSelect}
            onFileUpload={onFileUpload}
            value={block.previewUrl}
            accept="image/*"
          />
        </div>
      );
    case "video":
      return (
        <div className="space-y-2">
          <Input
            value={typeof block.content === "string" ? block.content : ""}
            onChange={(e) => updateContent(block.id, e.target.value)}
            placeholder="Enter video URL (YouTube, Vimeo, etc.)"
          />
          {/* {block.content && (
            typeof block.content === "string" && !block.content.startsWith("blob:") ? (
              block.content.includes("youtube.com") || block.content.includes("youtu.be") ? (
                <div className="mt-2 aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${
                      block.content.includes("youtu.be")
                        ? block.content.split("/").pop()
                        : block.content.split("v=")[1]?.split("&")[0]
                    }`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-md"
                  ></iframe>
                </div>
              ) : (
                <div className="mt-2 aspect-video bg-muted rounded-md flex items-center justify-center">
                  <Video className="h-10 w-10 text-muted-foreground" />
                </div>
              )
            ) : (
              <video
                controls
                className="w-full rounded-md my-4"
                src={
                  block.content instanceof File
                    ? URL.createObjectURL(block.content)
                    : block.content
                }
              />
            )
          )} */}
          <FileUploadArea
            onFileSelect={onFileSelect}
            onFileUpload={onFileUpload}
            value={
              typeof block.content === "string" &&
              block.content.startsWith("blob:")
                ? block.content
                : undefined
            }
            accept="video/*"
          />
        </div>
      );
    case "code":
      return (
        <Textarea
          value={block.content as string}
          onChange={(e) => updateContent(block.id, e.target.value)}
          placeholder="// Enter your code here"
          className="min-h-[150px] font-mono text-sm"
        />
      );
    case "list":
      return (
        <Tiptap
          content={block.content as string}
          onChange={(content) => updateContent(block.id, content)}
          showMathToolbar={showMathToolbar}
          setShowMathToolbar={setShowMathToolbar}
        />
      );
    default:
      return null;
  }
}
