"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { IconCollection, IconSize } from "@/types/icons"
import { cn } from "@/lib/utils"

interface IconGridProps {
  icons: IconCollection[]
  size: IconSize
  onIconClick: (iconId: string) => void
}

export default function IconGrid({ icons, size, onIconClick }: IconGridProps) {
  const [selectedIcons, setSelectedIcons] = useState<Set<string>>(new Set())

  const toggleIconSelection = (iconId: string, event: React.MouseEvent) => {
    event.stopPropagation()

    const newSelection = new Set(selectedIcons)
    if (newSelection.has(iconId)) {
      newSelection.delete(iconId)
    } else {
      newSelection.add(iconId)
    }

    setSelectedIcons(newSelection)
  }

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "w-6 h-6"
      case "large":
        return "w-12 h-12"
      default:
        return "w-8 h-8"
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {icons.map((icon) => (
        <Card
          key={icon.id}
          className={cn(
            "cursor-pointer hover:border-primary/50 transition-all",
            selectedIcons.has(icon.id) && "border-primary",
          )}
          onClick={() => onIconClick(icon.id)}
        >
          <CardContent className="p-4 relative">
            <div className="absolute top-0 right-0 p-1">
              <Checkbox
                checked={selectedIcons.has(icon.id)}
                onCheckedChange={() => {
                  const newSelection = new Set(selectedIcons)
                  if (newSelection.has(icon.id)) {
                    newSelection.delete(icon.id)
                  } else {
                    newSelection.add(icon.id)
                  }
                  setSelectedIcons(newSelection)
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-2 pt-4">
              <div className="flex items-center justify-center h-16">
                <div dangerouslySetInnerHTML={{ __html: icon.svg }} className={cn(getSizeClass())} />
              </div>
              <p className="text-xs text-center truncate w-full mt-2">{icon.name}</p>
              <span className="text-xs text-muted-foreground">{icon.library}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
