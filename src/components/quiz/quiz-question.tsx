"use client";
import { SingleChoice } from "./question-types/single-choice";
import { MultipleChoice } from "./question-types/multiple-choice";
import { TrueFalse } from "./question-types/true-false";
import { Matching } from "./question-types/matching";
import { ImageMatching } from "./question-types/image-matching";
import { FillBlanks } from "./question-types/fill-banks";

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
export type QuestionType =
  | "single-choice"
  | "multiple-choice"
  | "true-false"
  | "matching"
  | "image-matching"
  | "fill-blanks";

export interface BaseQuestion {
  id: string;
  question_text: string;
  question_type: string;
  content: any;
  points?: number;
  question_order?: number;
}

export interface SingleChoiceQuestion extends BaseQuestion {
  question_type: "single-choice";
  content: {
    options: Array<{
      id: string;
      text: string;
      is_correct?: boolean;
    }>;
  };
  correctAnswer?: string; // Index of the correct option
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  question_type: "multiple-choice";
  content: {
    options: Array<{
      id: string;
      text: string;
      is_correct?: boolean;
    }>;
  };
  correctAnswers?: string[]; // Mảng ID của các lựa chọn đúng
}

export interface TrueFalseQuestion extends BaseQuestion {
  question_type: "true-false";
  content: {};
  correctAnswer?: boolean;
}

export interface MatchingQuestion extends BaseQuestion {
  question_type: "matching";
  content: {
    items: Array<{ id: string; text: string }>;
    matches: Array<{ id: string; text: string }>;
  };
  correctAnswers?: Array<{
    key: string;
    value: string;
  }>;
}

export interface ImageMatchingQuestion extends BaseQuestion {
  question_type: "image-matching";
  content: {
    labels: Array<{ id: string; text: string }>;
    image_urls: Array<{ id: string; url: string }>;
    preview_urls?: string[];
  };
  correctAnswers?: Array<{
    key: string;
    value: string;
  }>;
}

export interface FillBlanksQuestion extends BaseQuestion {
  question_type: "fill-blanks";
  content: {
    answers: Array<{ id: string; text: string }>;
  };
  correctAnswers?: string[];
}

export type Question =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | MatchingQuestion
  | ImageMatchingQuestion
  | FillBlanksQuestion;

export type Answer = {
  question_id: string;
  question_type: QuestionType;
  answer: string | string[] | (string | null)[] | boolean | Record<string, string>;
};

interface QuizQuestionProps {
  question: Question;
  currentAnswer: Answer | null;
  onAnswerSelect: (answer: Answer) => void;
  showResult: boolean;
  questionNumber: number;
}

export function QuizQuestion({
  question,
  currentAnswer,
  onAnswerSelect,
  showResult,
  questionNumber,
}: QuizQuestionProps) {

  // console.log('>>>currentAnswer in quiz question: ', currentAnswer);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-start mb-4">
        <span className="flex items-center justify-center bg-primary/10 text-primary font-medium rounded-full w-8 h-8 mr-3 flex-shrink-0">
          {questionNumber}
        </span>
        {question.question_type !== "fill-blanks" && (
          <h3
            className="text-lg font-medium"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(renderKatex(question.question_text)),
            }}
          ></h3>
        )}
        {question.question_type === "fill-blanks" && (
          <h3 className="text-lg font-medium">Điền vào chỗ trống</h3>
        )}
      </div>

      {question.question_type === "single-choice" && (
        <SingleChoice
          question={question}
          currentAnswer={currentAnswer?.answer as string | null}
          onAnswerSelect={(answer: string) => onAnswerSelect({
            question_id: question.id,
            question_type: "single-choice",
            answer
          })}
          showResult={showResult}
        />
      )}

      {question.question_type === "multiple-choice" && (
        <MultipleChoice
          question={question}
          currentAnswers={(currentAnswer?.answer as string[]) || []}
          onAnswerSelect={(answers: string[]) =>
            onAnswerSelect({
              question_id: question.id,
              question_type: "multiple-choice",
              answer: answers,
            })
          }
          showResult={showResult}
        />
      )}

      {question.question_type === "true-false" && (
        <TrueFalse
          correctAnswer={question.correctAnswer as boolean}
          currentAnswer={currentAnswer?.answer as boolean | null}
          onAnswerSelect={(value: boolean) => onAnswerSelect({
            question_id: question.id,
            question_type: "true-false",
            answer: value
          })}
          showResult={showResult}
        />
      )}

      {question.question_type === "matching" && (
        <Matching
          content={question.content}
          currentAnswers={currentAnswer?.answer as Record<string, string> | null}
          onAnswerSelect={(answers: Record<string, string>) => onAnswerSelect({
            question_id: question.id,
            question_type: "matching",
            answer: answers
          })}
          showResult={showResult}
          correctAnswers={question.correctAnswers}
        />
      )}

      {question.question_type === "image-matching" && (
        <ImageMatching
          content={question.content}
          currentAnswers={currentAnswer?.answer as Record<string, string> | null}
          onAnswerSelect={(answers: Record<string, string>) => onAnswerSelect({
            question_id: question.id,
            question_type: "image-matching",
            answer: answers
          })}
          showResult={showResult}
          correctAnswers={question.correctAnswers}
        />
      )}

      {question.question_type === "fill-blanks" && (
        <FillBlanks
          question={question}
          currentAnswers={currentAnswer?.answer as (string | null)[] | null}
          onAnswerSelect={(answers: (string | null)[]) => onAnswerSelect({
            question_id: question.id,
            question_type: "fill-blanks",
            answer: answers
          })}
          showResult={showResult}
        />
      )}
    </div>
  );
}
