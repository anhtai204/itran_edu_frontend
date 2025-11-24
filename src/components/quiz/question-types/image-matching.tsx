"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, RefreshCw, X } from "lucide-react";
import Image from "next/image";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

import "katex/dist/katex.min.css";
import katex from "katex";
import DOMPurify from "dompurify";
// import { renderKatex } from "@/utils/action";

const renderKatex = (content: string) => {
  if (typeof document !== "undefined") {
    // Ensure content is a string
    let cleanedContent = String(content);
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
};

interface ImageMatchingProps {
  content: {
    image_urls: Array<{
      id: string;
      url: string;
    }>;
    labels: Array<{
      id: string;
      text: string;
    }>;
  };
  currentAnswers: Record<string, string> | null;
  onAnswerSelect: (answers: Record<string, string>) => void;
  showResult: boolean;
  correctAnswers?: Array<{
    key: string;
    value: string;
  }>;
}

export function ImageMatching({
  currentAnswers,
  onAnswerSelect,
  content,
  showResult,
  correctAnswers,
}: ImageMatchingProps) {
  const [current_matches, setCurrentMatches] = useState<Record<string, string>>(
    {}
  )

  // console.log('>>>current answers image matching: ', currentAnswers)
  // console.log('>>>correct answers image matching: ', correctAnswers)
  // console.log('>>>content image matching: ', content)

  useEffect(() => {
    if (currentAnswers) {
      setCurrentMatches(currentAnswers);
    }
  }, [currentAnswers]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || showResult) return;

    const { source, destination, draggableId } = result;

    // If dragging from right to left (matching)
    if (
      source.droppableId === "right-items" &&
      destination.droppableId.startsWith("left-drop-")
    ) {
      const itemId = destination.droppableId.replace("left-drop-", "");
      const matchedId = draggableId;

      // Update matches
      const newMatches = { ...current_matches, [itemId]: matchedId };
      setCurrentMatches(newMatches);
      onAnswerSelect(newMatches);
    }
    // If dragging from a matched position back to right column (unmatching)
    else if (
      source.droppableId.startsWith("left-drop-") &&
      destination.droppableId === "right-items"
    ) {
      const leftId = source.droppableId.replace("left-drop-", "");
      const rightId = draggableId.replace("matched-", "");

      // Remove from matches
      const newMatches = { ...current_matches };
      delete newMatches[leftId];
      setCurrentMatches(newMatches);
      onAnswerSelect(newMatches);
    }
  };

  const resetMatches = () => {
    setCurrentMatches({});
    onAnswerSelect({});
  };

  const isCorrectMatch = (url_id: string) => {
    const label_id = current_matches[url_id];
    if (!label_id || !url_id) return false;

    const correct_match = correctAnswers?.find(
      (match) => match.key === url_id
    );

    return label_id === correct_match?.value;
  };

  const getMatchedRightItem = (item_id: string) => {
    return content.labels.find(
      (match) => match.id === current_matches[item_id]
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="mt-4">
        <div className="items-start">
          {/* Left column (images) */}
          <div className="w-full">
            {content.image_urls.map((leftItem) => {
              const isMatched = leftItem.id in current_matches;
              const matchedRightItem = getMatchedRightItem(leftItem.id);
              const isCorrect = showResult && isCorrectMatch(leftItem.id);
              return (
                <div
                  key={`left-${leftItem.id}`}
                  className={"relative inline-block w-1/2 p-2"}
                >
                  <div
                    className={cn(
                      "rounded-md border border-gray-200 dark:border-gray-700 transition-colors",
                      isMatched &&
                        !showResult &&
                        "bg-primary/10 border-primary/30",
                      showResult &&
                        isCorrect &&
                        "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900",
                      showResult &&
                        isMatched &&
                        !isCorrect &&
                        "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900"
                    )}
                  >
                    <div className="flex flex-col items-center">
                      <div className="relative w-full h-32">
                        <Image
                          src={
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/${leftItem.url}`
                             ||
                            "/assets/images/not_found.jpg?height=128&width=256"
                          }
                          alt="Match item"
                          fill
                          className="object-contain"
                        />
                      </div>

                      {isMatched ? (
                        <div className="flex items-center mt-2">
                          <span
                            className="text-sm font-medium"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                matchedRightItem?.text || "?"
                              ),
                            }}
                          ></span>
                          {showResult &&
                            (isCorrect ? (
                              <Check className="h-4 w-4 ml-2 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 ml-2 text-red-500" />
                            ))}
                        </div>
                      ) : (
                        <div className="flex items-center mt-2 text-gray-400 dark:text-gray-500 text-sm italic">
                          <span className="text-sm">Kéo thả vào đây</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isMatched && !showResult && (
                    <Droppable
                      droppableId={`left-drop-${leftItem.id}`}
                      direction="vertical"
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            "absolute inset-0 rounded-md border-2 border-dashed m-1",
                            snapshot.isDraggingOver
                              ? "border-primary bg-primary/5"
                              : "border-dashed border-gray-400 dark:border-gray-500"
                          )}
                        >
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right column (text) */}
          {!showResult && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Các lựa chọn:</h4>
              <Droppable droppableId="right-items" direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-wrap gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-md min-h-[60px]"
                  >
                    {content.labels
                      .filter(
                        (item) =>
                          !Object.values(current_matches).includes(item.id)
                      )
                      .map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                          isDragDisabled={showResult}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "p-3 rounded-md border border-gray-200 dark:border-gray-700 transition-colors",
                                snapshot.isDragging &&
                                  "ring-2 ring-primary shadow-lg",
                                !showResult &&
                                  "hover:bg-gray-50 dark:hover:bg-gray-800 cursor-grab"
                              )}
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(item.text),
                              }}
                            ></div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )}
        </div>

        {!showResult && (
          <div className="mt-4 flex justify-end">
            <div className="italic text-sm text-gray-500 dark:text-gray-400 w-full">
              Hướng dẫn: Kéo thả <b>các lựa chọn</b> vào một trong{" "}
              <b>các ô trống ở phía trên</b>.
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetMatches}
              disabled={Object.keys(current_matches).length === 0}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm lại
            </Button>
          </div>
        )}

        {showResult && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <h4 className="font-medium mb-2">Đáp án đúng:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.image_urls.map((image) => {
                const correctMatch = correctAnswers?.find(
                  (match) => match.key === image.id
                );
                const correctLabel = content.labels.find(
                  (label) => label.id === correctMatch?.value
                );

                return (
                  <div key={`correct-${image.id}`} className="flex items-center">
                    <div className="relative w-12 h-12 mr-2">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${image.url}`}
                        alt="Item"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                    <span dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(correctLabel?.text || "?")
                    }}></span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
}
