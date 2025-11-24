"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import type { IconCollection } from "@/types/icons"
import { Copy, Check, Download, Code } from "lucide-react"

interface IconPreviewProps {
  iconId: string
  onClose: () => void
  collections: IconCollection[]
}

export default function IconPreview({ iconId, onClose, collections }: IconPreviewProps) {
  const [copied, setCopied] = useState(false)
  const [size, setSize] = useState(24)
  const [color, setColor] = useState("#000000")
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [rotation, setRotation] = useState(0)

  const icon = collections.find((icon) => icon.id === iconId)

  if (!icon) return null

  // Create a modified SVG with the custom properties
  const createCustomSvg = () => {
    // This is a simplified version - in a real app you'd use a proper SVG parser
    let customSvg = icon.svg
      .replace(/width="[^"]*"/, `width="${size}"`)
      .replace(/height="[^"]*"/, `height="${size}"`)
      .replace(/stroke="[^"]*"/, `stroke="${color}"`)
      .replace(/strokeWidth="[^"]*"/, `strokeWidth="${strokeWidth}"`)

    if (rotation !== 0) {
      customSvg = customSvg.replace("<svg", `<svg style="transform: rotate(${rotation}deg)"`)
    }

    return customSvg
  }

  const customSvg = createCustomSvg()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getSvgCode = () => icon.svg

  const getJsxCode = () => {
    // Convert SVG to JSX format
    return (
      `// ${icon.name} Icon from ${icon.library}\n` +
      `export const ${icon.name.replace(/\s+/g, "")}Icon = () => (\n` +
      `  ${icon.svg.replace(/<svg/, '<svg className="w-6 h-6"')}\n` +
      `)`
    )
  }

  const getHtmlCode = () => {
    return `<!-- ${icon.name} Icon from ${icon.library} -->\n${icon.svg}`
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl flex flex-col">
        <DialogHeader>
          <DialogTitle>{icon.name}</DialogTitle>
          <DialogClose />
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-white dark:bg-gray-800">
            <div
              className="flex items-center justify-center h-40 w-40"
              dangerouslySetInnerHTML={{ __html: customSvg }}
            />
            <div className="mt-4 text-sm text-muted-foreground">
              <span className="font-medium">{icon.library}</span> • {icon.categories.join(", ")}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Size</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[size]}
                  min={12}
                  max={64}
                  step={1}
                  onValueChange={(value) => setSize(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-right">{size}px</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                <div
                  className="w-10 h-10 rounded border cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => document.getElementById("color-picker")?.click()}
                />
                <Input
                  id="color-picker"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-0 h-0 opacity-0 absolute"
                />
                <Input value={color} onChange={(e) => setColor(e.target.value)} className="flex-1" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Stroke Width</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[strokeWidth]}
                  min={0.5}
                  max={4}
                  step={0.1}
                  onValueChange={(value) => setStrokeWidth(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-right">{strokeWidth}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rotation</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[rotation]}
                  min={0}
                  max={360}
                  step={15}
                  onValueChange={(value) => setRotation(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-right">{rotation}°</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="svg" className="mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="svg">SVG</TabsTrigger>
            <TabsTrigger value="jsx">JSX</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>

          <TabsContent value="svg" className="relative">
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">{getSvgCode()}</pre>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(getSvgCode())}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </TabsContent>

          <TabsContent value="jsx" className="relative">
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">{getJsxCode()}</pre>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(getJsxCode())}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </TabsContent>
          <TabsContent value="html" className="relative">
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">{getHtmlCode()}</pre>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(getHtmlCode())}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download SVG
            </Button>
            <Button>
              <Code className="h-4 w-4 mr-2" />
              Use in Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
