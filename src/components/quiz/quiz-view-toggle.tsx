"use client";

import { Button } from "@/components/ui/button";
import { ViewIcon, SplitIcon } from "lucide-react";

interface QuizViewToggleProps {
  viewMode: "single" | "multiple";
  onToggle: (mode: "single" | "multiple") => void;
}

export function QuizViewToggle({ viewMode, onToggle }: QuizViewToggleProps) {
  return (
    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
      <Button
        variant={viewMode === "single" ? "default" : "ghost"}
        size="sm"
        onClick={() => onToggle("single")}
        className="flex items-center gap-1"
      >
        <SplitIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Từng câu</span>
      </Button>
      <Button
        variant={viewMode === "multiple" ? "default" : "ghost"}
        size="sm"
        onClick={() => onToggle("multiple")}
        className="flex items-center gap-1"
      >
        <ViewIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Nhiều câu</span>
      </Button>
    </div>
  );
}
