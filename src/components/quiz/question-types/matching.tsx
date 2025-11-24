"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, RefreshCw, X } from "lucide-react";
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
};

interface MatchingProps {
  content: {
    items: Array<{
      id: string;
      text: string;
    }>;
    matches: Array<{
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

export function Matching({
  currentAnswers,
  onAnswerSelect,
  content,
  showResult,
  correctAnswers,
}: MatchingProps) {
  const [current_matches, setCurrentMatches] = useState<Record<string, string>>(
    {}
  );

  // console.log('>>>current answers matching: ', currentAnswers)
  // console.log('>>>correct answers matching: ', correctAnswers)
  // console.log('>>>content matching: ', content)

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

  const isCorrectMatch = (item_id: string) => {
    const match_id = current_matches[item_id];
    if (!match_id || !item_id) return false;

    const correct_match = correctAnswers?.find(
      (match) => match.key === item_id
    );

    return match_id === correct_match?.value;
  };

  const getMatchedRightItem = (item_id: string) => {
    return content.matches.find(
      (match) => match.id === current_matches[item_id]
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="mt-4">
        <div className="items-start">
          {/* Left column */}
          <div className="w-full space-y-3 p-3">
            {content.items.map((item) => {
              const isMatched = item.id in current_matches;
              const matchedRightItem = getMatchedRightItem(item.id);
              const isCorrect = showResult && isCorrectMatch(item.id);

              return (
                <div key={`item-${item.id}`} className="relative">
                  <div
                    className={cn(
                      "p-3 rounded-md border border-gray-200 dark:border-gray-700 transition-colors",
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
                    <div className="flex justify-between items-center text-justify">
                      <span
                        className="w-1/2 pr-2"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(renderKatex(item.text)),
                        }}
                      ></span>
                      {isMatched && (
                        <div className="flex items-center w-1/2">
                          <ArrowRight className="h-4 text-gray-400" />
                          <span
                            className="text-justify w-fit"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                renderKatex(matchedRightItem?.text || "")
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
                      )}
                    </div>
                  </div>

                  {!isMatched && !showResult && (
                    <Droppable
                      droppableId={`left-drop-${item.id}`}
                      direction="horizontal"
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            "absolute inset-0 rounded-md border-2 border-dashed text-center",
                            snapshot.isDraggingOver
                              ? "border-primary bg-primary/5"
                              : "w-1/2 ml-auto border-dashed border-gray-400 dark:border-gray-500"
                          )}
                        >
                          {provided.placeholder}
                          <span className="text-gray-400 dark:text-gray-500 text-sm italic">
                            Kéo thả vào đây
                          </span>
                        </div>
                      )}
                    </Droppable>
                  )}
                </div>
              );
            })}
          </div>

          {/* Matches */}
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
                    {content.matches
                      .filter(
                        (match) =>
                          !Object.values(current_matches).includes(match.id)
                      )
                      .map((match, index) => (
                        <Draggable
                          key={match.id}
                          draggableId={match.id}
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
                                __html: DOMPurify.sanitize(
                                  renderKatex(match.text)
                                ),
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

        {/* {showResult && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <h4 className="font-medium mb-2">Đáp án đúng:</h4>
            <div className="space-y-2">
              {question.items.map((item) => {
                const correctRightItem = question.items.find(
                  (i) => i.id === correctAnswers?.[item.id]
                );

                return (
                  <div key={`correct-${item.id}`} className="flex items-center">
                    <span className="font-medium">{item.left}</span>
                    <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                    <span>{correctRightItem?.right || "?"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )} */}
      </div>
    </DragDropContext>
  );
}
