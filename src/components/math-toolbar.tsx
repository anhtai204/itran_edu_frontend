
"use client"

import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Calculator,
  Sigma,
  Divide,
  Plus,
  Minus,
  Equal,
  X,
  Superscript,
  Subscript,
  Square,
  SquareIcon as SquareRoot,
  Pi,
  Infinity,
  ActivityIcon as Function,
  Percent,
  Radical,
  Diff,
  EqualNot,
  EqualApproximately,
  SquareSigma,
  Option,
  SquareFunction,
} from "lucide-react"

interface MathToolbarProps {
  editor: Editor | null
}

export function MathToolbar({ editor }: MathToolbarProps) {
  if (!editor) {
    return null
  }

  const insertInlineKatex = (formula: string) => {
    // Sử dụng command mới cho inline katex
    editor.chain().focus().insertInlineKatex(formula).run()
  }

  const insertBlockKatex = (formula: string) => {
    // Sử dụng command cũ cho block katex
    editor.chain().focus().insertKatex(formula).run()
  }

  // Các ký hiệu toán học phổ biến - sẽ được chèn như inline
  const inlineMathSymbols = [
    { icon: <Pi className="h-4 w-4" />, formula: "\\pi", tooltip: "Pi (π)" },
    { icon: <Square className="h-4 w-4" />, formula: "x^2", tooltip: "Square" },
    { icon: <Radical  className="h-4 w-4" />, formula: "\\sqrt{x}", tooltip: "Square Root" },
    { icon: <Plus className="h-4 w-4" />, formula: "a + b", tooltip: "Addition" },
    { icon: <Minus className="h-4 w-4" />, formula: "a - b", tooltip: "Subtraction" },
    { icon: <X className="h-4 w-4" />, formula: "a \\times b", tooltip: "Multiplication" },
    { icon: <Equal className="h-4 w-4" />, formula: "a = b", tooltip: "Equality" },
    { icon: <Superscript className="h-4 w-4" />, formula: "x^{n}", tooltip: "Superscript" },
    { icon: <Subscript className="h-4 w-4" />, formula: "x_{i}", tooltip: "Subscript" },
    { icon: <Infinity className="h-4 w-4" />, formula: "\\infty", tooltip: "Infinity" },
    { icon: <Percent className="h-4 w-4" />, formula: "\\%", tooltip: "Percent" },
    { icon: <Diff className="h-4 w-4" />, formula: "\\pm", tooltip: "Diff" },
    { icon: <EqualNot className="h-4 w-4" />, formula: "\\not =", tooltip: "Equal not" },
    { icon: <EqualApproximately className="h-4 w-4" />, formula: "\\approx", tooltip: "Approximately" },
    { icon: <Option className="h-4 w-4" />, formula: "\\lim\\limits_x", tooltip: "Lim" },
    { icon: <SquareFunction className="h-4 w-4" />, formula: "\\intop_x^{\\smash{y}}", tooltip: "Original" },

  ]

  // Các công thức phức tạp hơn - sẽ được chèn như block
  const blockMathSymbols = [
    { icon: <Sigma className="h-4 w-4" />, formula: "\\sum_{i=1}^{n} x_i", tooltip: "Sum (Σ)" },
    { icon: <Divide className="h-4 w-4" />, formula: "\\frac{a}{b}", tooltip: "Fraction" },
    { icon: <Function className="h-4 w-4" />, formula: "f(x) = x^2", tooltip: "Function" },
  ]

  return (
    <div className="flex flex-wrap gap-1 border rounded-md p-1 mb-1 bg-slate-50 dark:bg-gray-800">
      <TooltipProvider>
        <div className="flex gap-1 items-center mr-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => insertInlineKatex("")} 
                className="h-8 px-2 dark:text-white"
              >
                <Calculator className="h-4 w-4 mr-1" />
                <span>Inline</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Insert inline math formula</p>
            </TooltipContent>
          </Tooltip>

          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => insertBlockKatex("")} 
                className="h-8 px-2 dark:text-white"
              >
                <Calculator className="h-4 w-4 mr-1" />
                <span>Block</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Insert block math formula</p>
            </TooltipContent>
          </Tooltip> */}
        </div>

        {/* Inline Math Symbols */}
        {inlineMathSymbols.map((symbol, index) => (
          <Tooltip key={`inline-${index}`}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertInlineKatex(symbol.formula)}
                className="h-8 w-8 p-0 dark:text-white"
              >
                {symbol.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{symbol.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        {/* Block Math Symbols */}
        {blockMathSymbols.map((symbol, index) => (
          <Tooltip key={`block-${index}`}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertBlockKatex(symbol.formula)}
                className="h-8 w-8 p-0 dark:text-white border-l first:border-l-0 border-gray-200"
              >
                {symbol.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{symbol.tooltip} (Block)</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}