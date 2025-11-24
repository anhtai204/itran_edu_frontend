"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { TagDialog } from "./tag-dialog"

interface Tag {
  id: string
  name: string
  description: string
  slug: string
}

interface TagTableProps {
  tags: Tag[]
  onUpdate: (tag: Tag) => void
  onDelete: (id: string) => void
}

export function TagTable({ tags, onUpdate, onDelete }: TagTableProps) {
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [deletingTag, setDeletingTag] = useState<string | null>(null)

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
  }

  const handleDelete = (tagId: string) => {
    setDeletingTag(tagId)
  }

  const confirmDelete = () => {
    if (deletingTag) {
      onDelete(deletingTag)
      setDeletingTag(null)
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="w-[100px]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                Không có thẻ nào. Hãy thêm thẻ mới.
              </TableCell>
            </TableRow>
          ) : (
            tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="font-medium">{tag.name}</TableCell>
                <TableCell>{tag.description}</TableCell>
                <TableCell>{tag.slug}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(tag)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(tag.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {editingTag && (
        <TagDialog
          open={!!editingTag}
          onOpenChange={() => setEditingTag(null)}
          onSubmit={(updatedTag) => {
            onUpdate({ ...updatedTag, id: editingTag.id })
            setEditingTag(null)
          }}
          defaultValues={editingTag}
        />
      )}

      <AlertDialog open={!!deletingTag} onOpenChange={() => setDeletingTag(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Thẻ này sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

