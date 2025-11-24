"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useId } from "react";
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

interface SingleChoiceProps {
  question: {
    id: string;
    question_text: string;
    content: {
      options: Array<{
        id: string;
        text: string;
      }>;
    };
    question_order?: number;
    correctAnswer?: string;
  };
  currentAnswer: string | null;
  onAnswerSelect: (optionId: string) => void;
  showResult: boolean;
}

export const SingleChoice = ({
  question,
  currentAnswer,
  onAnswerSelect,
  showResult,
}: SingleChoiceProps) => {
  // Generate a unique ID for this question instance
  const instanceId = useId();

  // console.log('>>>question single choice: ', question)
  // console.log('>>>correct answer single choice: ', question.correctAnswer)

  return (
    <RadioGroup 
      value={currentAnswer || undefined}
      onValueChange={(value) => onAnswerSelect(value)}
      className="space-y-3 mt-4"
    >
      {question.content.options.map((option, index) => {
        // console.log('>>>option single choice: ', option)
        // console.log('>>>index single choice: ', index)
        // console.log('>>>question.correctAnswers single choice: ', question.correctAnswers)
        const option_katex = renderKatex(option.text);

        const isCorrect = showResult && option.id === question.correctAnswer;
        const isIncorrect =
          showResult &&
          currentAnswer === option.id &&
          option.id !== question.correctAnswer;
        const optionId = `${instanceId}-option-${question.id}-${index}`;

        return (
          <div
            key={optionId}
            className={cn(
              "mt-0 mb-0 flex items-center rounded-md border border-gray-200 dark:border-gray-700",
              isCorrect &&
                "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900",
              isIncorrect &&
                "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900"
            )}
          >
            <RadioGroupItem
              value={option.id}
              id={optionId}
              disabled={showResult}
              className="mr-2 ml-2"
            />
            <Label
              htmlFor={optionId}
              className="pt-3 pb-3 inline-block flex-grow cursor-pointer"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(option_katex),
              }}
            ></Label>
            {showResult && isCorrect && (
              <span className="mr-3 text-green-600 dark:text-green-400 text-sm font-medium">
                Đáp án đúng
              </span>
            )}
            {showResult && isIncorrect && (
              <span className="mr-3 text-red-600 dark:text-red-400 text-sm font-medium">
                Đáp án sai
              </span>
            )}
          </div>
        );
      })}
    </RadioGroup>
  );
};
