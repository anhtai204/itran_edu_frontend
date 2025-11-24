"use client";

import React, { JSX } from "react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
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
      .replace(/\\+/g, "\\") // Thay \\ thành \
      .replace(/<p[^>]*>/g, '') // Loại bỏ thẻ p mở
      .replace(/<\/p>/g, '') // Loại bỏ thẻ p đóng
      .replace(/whitespace-pre-wrap/g, '') // Loại bỏ class whitespace-pre-wrap
      .replace(/mb-4/g, ''); // Loại bỏ class mb-4

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

interface FillBlanksProps {
  question: {
    id: string;
    question_text: string;
    content: {
      answers: Array<{
        id: string;
        text: string;
      }>;
    };
    correctAnswer?: string[];
  };
  currentAnswers: (string | null)[] | null;
  onAnswerSelect: (answers: (string | null)[]) => void;
  showResult: boolean;
}

export function FillBlanks({
  question,
  currentAnswers,
  onAnswerSelect,
  showResult,
}: FillBlanksProps) {
  const [filledBlanks, setFilledBlanks] = useState<Record<string, string>>({});
  const [availableOptions, setAvailableOptions] = useState<
    Array<{ id: string; content: string; used: boolean }>
  >([]);

  // console.log('>>>question fill blanks: ', question)
  // console.log('>>>currentAnswers fill blanks: ', currentAnswers)
  // console.log('>>>correct answers fill blanks: ', question.correctAnswer)  

  // Find blank positions and their content
  const blanks = useMemo(() => {
    const positions: Array<{ start: number; end: number; index: number }> = [];
    const regex = /\[\[(.*?)\]\]/g;
    let match;
    let index = 0;
    
    while ((match = regex.exec(question.question_text)) !== null) {
      positions.push({
        start: match.index,
        end: match.index + match[0].length,
        index: index++
      });
    }
    
    return positions;
  }, [question.question_text]);

  // Initialize from currentAnswers
  useEffect(() => {
    if (currentAnswers) {
      // Convert array to object with blank indices as keys
      const blankObject: Record<string, string> = {};
      currentAnswers.forEach((value, index) => {
        if (value !== null) {
          blankObject[index.toString()] = value;
        }
      });
      setFilledBlanks(blankObject);

      // Mark used options
      setAvailableOptions((prev) =>
        prev.map((option) => ({
          ...option,
          used: Object.values(blankObject).some(
            (answer) => answer === option.id
          ),
        }))
      );
    }
  }, [currentAnswers]);

  // Initialize available options
  useEffect(() => {
    const options = question.content.answers.map((answer) => ({
      id: answer.id,
      content: answer.text,
      used: false,
    }));
    setAvailableOptions(shuffleArray([...options]));
  }, [question.content.answers]);

  // Helper function to shuffle array
  function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || showResult) return;

    const { source, destination, draggableId } = result;

    // If dragging from options to a blank
    if (
      source.droppableId === "options" &&
      destination.droppableId.startsWith("blank-")
    ) {
      const blankId = destination.droppableId.replace("blank-", "");
      const optionId = draggableId;
      const option = availableOptions.find((opt) => opt.id === optionId);

      if (!option) return;

      // Update filled blanks
      const newFilledBlanks = { ...filledBlanks, [blankId]: option.id };
      setFilledBlanks(newFilledBlanks);

      // Create array of answers in order
      const orderedAnswers = Array(blanks.length).fill(null);
      Object.entries(newFilledBlanks).forEach(([key, value]) => {
        orderedAnswers[parseInt(key)] = value;
      });
      onAnswerSelect(orderedAnswers);

      // Mark option as used
      setAvailableOptions((prev) =>
        prev.map((opt) => (opt.id === optionId ? { ...opt, used: true } : opt))
      );
    }

    // If dragging from a blank back to options (removing)
    else if (
      source.droppableId.startsWith("blank-") &&
      destination.droppableId === "options"
    ) {
      const blankId = source.droppableId.replace("blank-", "");
      const optionId = filledBlanks[blankId];

      // Remove from filled blanks
      const newFilledBlanks = { ...filledBlanks };
      delete newFilledBlanks[blankId];
      setFilledBlanks(newFilledBlanks);

      // Create array of answers in order
      const orderedAnswers = Array(blanks.length).fill(null);
      Object.entries(newFilledBlanks).forEach(([key, value]) => {
        orderedAnswers[parseInt(key)] = value;
      });
      onAnswerSelect(orderedAnswers);

      // Mark option as unused
      setAvailableOptions((prev) =>
        prev.map((opt) =>
          opt.id === optionId ? { ...opt, used: false } : opt
        )
      );
    }
  };

  const resetBlanks = () => {
    setFilledBlanks({});
    // Reset with array of nulls
    onAnswerSelect(Array(blanks.length).fill(null));

    // Reset all options to unused
    setAvailableOptions((prev) => prev.map((opt) => ({ ...opt, used: false })));
  };

  const isBlankFilled = (blankId: string) => {
    return blankId in filledBlanks;
  };

  const isCorrectAnswer = (blankId: string) => {
    if (!showResult) return false;

    // Find the index of the blank in the filledBlanks array
    const filledBlankIndex = Object.keys(filledBlanks).findIndex(
      (key) => key === blankId
    );

    // Find the index of the blank in the correct_answers array
    console.log("correct_answers", question.correctAnswer);

    const correctAnswerId =
      question.correctAnswer?.[filledBlankIndex];

    console.log(
      `Checking blank ${blankId}: filledBlanks[${blankId}] = ${filledBlanks[blankId]}, correctAnswerId = ${correctAnswerId}`
    );

    return filledBlanks[blankId] === correctAnswerId;
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="mt-4">
        {/* Text with blanks */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 leading-relaxed">
          {(() => {
            let lastIndex = 0;
            const elements: JSX.Element[] = [];

            // Add text before first blank
            if (blanks.length > 0 && blanks[0].start > 0) {
              elements.push(
                <span
                  key="text-0"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      renderKatex(question.question_text.slice(0, blanks[0].start))
                    ),
                  }}
                  className="inline"
                />
              );
            }

            // Add blanks and text between them
            blanks.forEach((blank, i) => {
              const blankId = blank.index.toString();
              const isFilled = isBlankFilled(blankId);
              const isCorrect = showResult && isCorrectAnswer(blankId);
              const isIncorrect = showResult && isFilled && !isCorrect;

              // Add the blank
              elements.push(
                <Droppable
                  key={`blank-${blank.index}`}
                  droppableId={`blank-${blankId}`}
                  isDropDisabled={showResult}
                >
                  {(provided, snapshot) => (
                    <span
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "inline-block min-w-24 text-center mx-1 px-2 py-1 border-2 rounded-md align-middle",
                        !isFilled &&
                          "border-dashed border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-700",
                        isFilled &&
                          !showResult &&
                          "border-primary bg-primary/10",
                        showResult &&
                          isCorrect &&
                          "border-green-500 bg-green-50 dark:bg-green-900/20",
                        showResult &&
                          isIncorrect &&
                          "border-red-500 bg-red-50 dark:bg-red-900/20",
                        snapshot.isDraggingOver && "bg-primary/5 border-primary"
                      )}
                    >
                      {isFilled ? (
                        <Draggable
                          draggableId={`filled-${blankId}`}
                          index={0}
                          isDragDisabled={showResult}
                        >
                          {(provided, snapshot) => (
                            <span
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "inline-block w-full",
                                !showResult && "cursor-grab"
                              )}
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                  renderKatex(
                                    question.content.answers.find(
                                      (b) => b.id === filledBlanks[blankId]
                                    )?.text || ""
                                  )
                                ),
                              }}
                            />
                          )}
                        </Draggable>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          Kéo thả vào đây
                        </span>
                      )}
                      {provided.placeholder}
                    </span>
                  )}
                </Droppable>
              );

              // Add text between this blank and next blank
              const nextBlank = blanks[i + 1];
              if (nextBlank) {
                elements.push(
                  <span
                    key={`text-${i + 1}`}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        renderKatex(
                          question.question_text.slice(
                            blank.end,
                            nextBlank.start
                          )
                        )
                      ),
                    }}
                    className="inline"
                  />
                );
              } else if (blank.end < question.question_text.length) {
                // Add remaining text after last blank
                elements.push(
                  <span
                    key={`text-${i + 1}`}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        renderKatex(
                          question.question_text.slice(blank.end)
                        )
                      ),
                    }}
                    className="inline"
                  />
                );
              }
            });

            return <div className="whitespace-normal inline-block">{elements}</div>;
          })()}
        </div>

        {/* Options */}
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Các lựa chọn:</h4>
          <Droppable
            droppableId="options"
            direction="vertical"
            isDropDisabled={showResult}
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-md min-h-[60px]"
              >
                {availableOptions
                  .filter(
                    (item) => !Object.values(filledBlanks).includes(item.id)
                  )
                  .map(
                    (option, index) =>
                      !option.used && (
                        <Draggable
                          key={option.id}
                          draggableId={option.id}
                          index={index}
                          isDragDisabled={showResult}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700",
                                snapshot.isDragging &&
                                  "ring-2 ring-primary shadow-lg",
                                !showResult &&
                                  "hover:bg-gray-50 dark:hover:bg-gray-800 cursor-grab"
                              )}
                            >
                              {option.content}
                            </div>
                          )}
                        </Draggable>
                      )
                  )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {!showResult && (
          <div className="mt-4 flex justify-end">
            <div className="italic text-sm text-gray-500 dark:text-gray-400 w-full">
              Hướng dẫn: Kéo thả <b>các lựa chọn</b> vào{" "}
              <b>ô trống ở phía trên</b>.
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetBlanks}
              disabled={Object.keys(filledBlanks).length === 0}
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
              {question.blanks.map((blank) => (
                <div key={`correct-${blank.id}`} className="flex items-center">
                  <span className="font-medium">{blank.id}:</span>
                  <span className="ml-2">{blank.correctAnswer}</span>
                </div>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </DragDropContext>
  );
}
