
"use client"

import { useState } from "react"
import {
  Bold,
  Italic,
  Underline,
  Code,
  List,
  ListOrderedIcon as OrderedList,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react"
import type { Editor } from "@tiptap/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface MenuBarProps {
  editor: Editor | null
}

const MenuBar = ({ editor }: MenuBarProps) => {
  const [open, setOpen] = useState(false)
  const [linkURL, setLinkURL] = useState("")

  if (!editor) {
    return null
  }

  const Options = [
    {
      icon: <Bold className="size-4" />,
      onclick: () => editor.chain().focus().toggleBold().run(),
      pressed: () => editor.isActive("bold"),
    },
    {
      icon: <Italic className="size-4" />,
      onclick: () => editor.chain().focus().toggleItalic().run(),
      pressed: () => editor.isActive("italic"),
    },
    {
      icon: <Underline className="size-4" />,
      onclick: () => editor.chain().focus().toggleUnderline().run(),
      pressed: () => editor.isActive("underline"),
    },
    {
      icon: <Code className="size-4" />,
      onclick: () => editor.chain().focus().toggleCode().run(),
      pressed: () => editor.isActive("code"),
    },
    {
      icon: <List className="size-4" />,
      onclick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: () => editor.isActive("bulletList"),
    },
    {
      icon: <OrderedList className="size-4" />,
      onclick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: () => editor.isActive("orderedList"),
    },
    {
      icon: <Heading1 className="size-4" />,
      onclick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: () => editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      onclick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: () => editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      onclick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: () => editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <Quote className="size-4" />,
      onclick: () => editor.chain().focus().toggleBlockquote().run(),
      pressed: () => editor.isActive("blockquote"),
    },
    {
      icon: <Link className="size-4" />,
      onclick: () => {
        if (editor.state.selection.empty) {
          alert("Please select some text first")
          return
        }
        setOpen(true)
      },
      pressed: () => editor.isActive("link"),
    },
    {
      icon: <Image className="size-4" />,
      onclick: () => {
        const url = prompt("Enter the image URL")

        if (url) {
          editor.chain().focus().setImage({ src: url }).run()
        }
      },
      pressed: () => editor.isActive("image"),
    },
    {
      icon: <AlignLeft className="size-4" />,
      onclick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: () => editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter className="size-4" />,
      onclick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: () => editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight className="size-4" />,
      onclick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: () => editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <AlignJustify className="size-4" />,
      onclick: () => editor.chain().focus().setTextAlign("justify").run(),
      pressed: () => editor.isActive({ textAlign: "justify" }),
    },
  ]

  const handleLinkSubmit = () => {
    editor.chain().focus().setLink({ href: linkURL }).run()
    setOpen(false)
  }

  return (
    <>
      <div className="flex gap-2 border-b border-input p-2">
        {Options.map((option, index) => (
          <button
            key={index}
            onClick={option.onclick}
            className={`rounded-md border p-1 hover:bg-secondary ${option.pressed() ? "bg-secondary" : ""}`}
          >
            {option.icon}
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
            <DialogDescription>Enter the URL for the link.</DialogDescription>
          </DialogHeader>
          <Input
            value={linkURL}
            onChange={(e) => setLinkURL(e.target.value)}
            placeholder="URL"
            className="col-span-3"
          />
          <DialogFooter>
            <Button type="submit" onClick={handleLinkSubmit}>
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MenuBar

