"use client"

import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
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
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface KatexToolbarProps {
  editor: Editor | null
}

export function KatexToolbar({ editor }: KatexToolbarProps) {
  if (!editor) {
    return null
  }

  const insertKatex = (formula: string) => {
    editor.chain().focus().insertKatex(formula).run()
  }

  const mathSymbols = [
    { icon: <Sigma className="h-4 w-4" />, formula: "\\sum_{i=1}^{n} x_i", tooltip: "Sum" },
    { icon: <Divide className="h-4 w-4" />, formula: "\\frac{a}{b}", tooltip: "Fraction" },
    { icon: <Square className="h-4 w-4" />, formula: "x^2", tooltip: "Square" },
    { icon: <SquareRoot className="h-4 w-4" />, formula: "\\sqrt{x}", tooltip: "Square Root" },
    { icon: <Plus className="h-4 w-4" />, formula: "a + b", tooltip: "Addition" },
    { icon: <Minus className="h-4 w-4" />, formula: "a - b", tooltip: "Subtraction" },
    { icon: <X className="h-4 w-4" />, formula: "a \\times b", tooltip: "Multiplication" },
    { icon: <Equal className="h-4 w-4" />, formula: "a = b", tooltip: "Equality" },
    { icon: <Superscript className="h-4 w-4" />, formula: "x^{n}", tooltip: "Superscript" },
    { icon: <Subscript className="h-4 w-4" />, formula: "x_{i}", tooltip: "Subscript" },
  ]

  return (
    <div className="border rounded-md p-1 mb-1 bg-slate-50 space-x-2 z-50 dark:bg-gray-800">
      <TooltipProvider>
        <Toggle pressed={editor.isActive("katex")} onPressedChange={() => insertKatex("")} className="dark:text-white">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Calculator className="h-4 w-4" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Insert Math Formula</p>
            </TooltipContent>
          </Tooltip>
        </Toggle>

        {mathSymbols.map((symbol, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => insertKatex(symbol.formula)}
            className="h-8 w-8 p-0 dark:text-white"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{symbol.icon}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{symbol.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </Button>
        ))}
      </TooltipProvider>
    </div>
  )
}

