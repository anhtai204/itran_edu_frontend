"use client"

import { useState } from "react"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Link, Image, Type, ChevronDown, Minus } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface TextFormattingToolbarProps {
  onFormatText: (formatType: string, value?: string) => void
  className?: string
}

export function TextFormattingToolbar({ onFormatText, className }: TextFormattingToolbarProps) {
  const [fontFamily, setFontFamily] = useState<string>("sans")
  const [fontSize, setFontSize] = useState<string>("normal")
  const [textColor, setTextColor] = useState<string>("#000000")
  const [bgColor, setBgColor] = useState<string>("")

  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value)
    onFormatText("fontFamily", value)
  }

  const handleFontSizeChange = (value: string) => {
    setFontSize(value)
    onFormatText("fontSize", value)
  }

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value)
    onFormatText("color", e.target.value)
  }

  const handleBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBgColor(e.target.value)
    onFormatText("backgroundColor", e.target.value)
  }

  return (
    <div className={cn("p-1 border rounded-md flex flex-wrap items-center gap-1 bg-background", className)}>
      <div className="flex items-center border-r pr-1 mr-1">
        {/* Font Family */}
        <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Font Family</SelectLabel>
              <SelectItem value="sans">Sans-serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Font Size */}
        <Select value={fontSize} onValueChange={handleFontSizeChange}>
          <SelectTrigger className="h-8 w-[80px] ml-1">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Font Size</SelectLabel>
              <SelectItem value="xs">Extra Small</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
              <SelectItem value="xl">Extra Large</SelectItem>
              <SelectItem value="2xl">2XL</SelectItem>
              <SelectItem value="3xl">3XL</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Text Formatting */}
      <ToggleGroup type="multiple" className="flex flex-wrap">
        <ToggleGroupItem value="bold" size="sm" onClick={() => onFormatText("bold")}>
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" size="sm" onClick={() => onFormatText("italic")}>
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" size="sm" onClick={() => onFormatText("underline")}>
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Type className="h-3.5 w-3.5" />
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Text Color</h4>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={textColor} 
                  onChange={handleTextColorChange}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
                <span className="text-sm">{textColor}</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Background Color</h4>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={bgColor || "#ffffff"} 
                  onChange={handleBgColorChange}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
                <span className="text-sm">{bgColor || "None"}</span>
                {bgColor && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setBgColor("")
                      onFormatText("backgroundColor", "")
                    }}
                    className="ml-auto h-7 px-2"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <div className="border-l pl-1 ml-1">
        {/* Alignment */}
        <ToggleGroup type="single" className="flex flex-wrap">
          <ToggleGroupItem value="left" size="sm" onClick={() => onFormatText("align", "left")}>
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" size="sm" onClick={() => onFormatText("align", "center")}>
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" size="sm" onClick={() => onFormatText("align", "right")}>
            <AlignRight className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="justify" size="sm" onClick={() => onFormatText("align", "justify")}>
            <AlignJustify className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="border-l pl-1 ml-1">
        {/* Lists */}
        <ToggleGroup type="single" className="flex flex-wrap">
          <ToggleGroupItem value="bullet" size="sm" onClick={() => onFormatText("list", "bullet")}>
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="numbered" size="sm" onClick={() => onFormatText("list", "numbered")}>
            <ListOrdered className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="border-l pl-1 ml-1">
        {/* Insert */}
        <ToggleGroup type="single" className="flex flex-wrap">
          <ToggleGroupItem value="link" size="sm" onClick={() => onFormatText("insert", "link")}>
            <Link className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="image" size="sm" onClick={() => onFormatText("insert", "image")}>
            <Image className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  )
}
