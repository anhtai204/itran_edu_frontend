"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useId } from "react";
import { Check, X } from "lucide-react";

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

interface TrueFalseProps {
  currentAnswer: boolean | null;
  onAnswerSelect: (answer: boolean) => void;
  showResult: boolean;
  correctAnswer: boolean;
}

export function TrueFalse({
  currentAnswer,
  onAnswerSelect,
  showResult,
  correctAnswer,
}: TrueFalseProps) {
  const instanceId = useId();

  console.log('>>>currentAnswer true false: ', currentAnswer)
  console.log('>>>correctAnswer true false: ', correctAnswer)

  return (
    <RadioGroup
      value={currentAnswer ? currentAnswer.toString() : undefined}
      onValueChange={(value) => onAnswerSelect(value === "true")}
      className="space-y-3 mt-4"
    >
      {[
        { value: "true", label: "Đúng", icon: Check },
        { value: "false", label: "Sai", icon: X },
      ].map((option) => {
        // console.log('>>>option true false: ', option)
        // console.log('>>>currentAnswer true false: ', currentAnswer)
        // console.log('>>>correctAnswer true false: ', correctAnswer)
        const isSelected = currentAnswer === (option.value === "true");
        const isCorrect =
          showResult && correctAnswer === (option.value === "true");
        const isIncorrect =
          showResult &&
          isSelected &&
          correctAnswer !== (option.value === "true");
        const optionId = `${instanceId}-option-${option.value}`;

        return (
          <div
            key={optionId}
            className={cn(
              "mt-0 mb-0 flex items-center space-x-2 rounded-md border border-gray-200 dark:border-gray-700",
              isCorrect &&
                "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900",
              isIncorrect &&
                "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900"
            )}
          >
            <RadioGroupItem
              value={option.value}
              id={optionId}
              disabled={showResult}
              className="mr-2 ml-2"
            />
            <Label
              htmlFor={optionId}
              className="pt-3 pb-3 inline-block flex-grow cursor-pointer flex items-center"
            >
              <option.icon className="mr-2 h-5 w-5" />
              {option.label}
            </Label>
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
}
