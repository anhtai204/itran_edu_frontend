import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useId } from "react";

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

interface MultipleChoiceProps {
  question: {
    id: string;
    question_text: string;
    content: {
      options: Array<{
        id: string;
        text: string;
        is_correct?: boolean;
      }>;
    };
    correctAnswers?: string[]; // Mảng ID thay vì chỉ số
  };
  currentAnswers: string[];
  onAnswerSelect: (answers: string[]) => void;
  showResult: boolean;
}

export function MultipleChoice({
  question,
  currentAnswers,
  onAnswerSelect,
  showResult,
}: MultipleChoiceProps) {
  const instanceId = useId();

  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    if (checked) {
      onAnswerSelect([...currentAnswers, optionId]);
    } else {
      onAnswerSelect(currentAnswers.filter((id) => id !== optionId));
    }
  };

  // console.log('>>>question in multiple choice: ', question);
  // console.log('>>>current answers in multiple choice: ', currentAnswers);
  // console.log('>>>correct answers in multiple choice: ', question.correctAnswers);

  return (
    <div className="space-y-3 mt-4">
      {question.content.options.map((option, index) => {
        const option_katex = renderKatex(option.text);
        const isSelected = currentAnswers.includes(option.id);
        // Kiểm tra xem option.id có trong correctAnswers không
        const isCorrect =
          showResult &&
          question.correctAnswers &&
          Array.isArray(question.correctAnswers) &&
          question.correctAnswers.includes(option.id);
        const isIncorrect = showResult && isSelected && !isCorrect;
        const optionId = `${instanceId}-option-${question.id}-${index}`;

        return (
          <div
            key={optionId}
            className={cn(
              "p-0 flex items-center rounded-md border border-gray-200 dark:border-gray-700",
              isCorrect &&
                "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900",
              isIncorrect &&
                "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900"
            )}
          >
            <Checkbox
              id={optionId}
              checked={isSelected}
              onCheckedChange={(checked) =>
                handleCheckboxChange(option.id, checked as boolean)
              }
              disabled={showResult}
              className="mr-2 ml-2"
            />
            <Label
              htmlFor={optionId}
              className="inline-block pt-3 pb-3 flex-grow cursor-pointer"
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
      {showResult && (
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {question.correctAnswers && Array.isArray(question.correctAnswers) && question.correctAnswers.length > 1
            ? `Câu hỏi này có ${question.correctAnswers.length} đáp án đúng.`
            : "Câu hỏi này có 1 đáp án đúng."}
        </div>
      )}
    </div>
  );
}