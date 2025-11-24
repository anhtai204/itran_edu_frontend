"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { handleUpdatePostTagAction } from "@/utils/action"

interface IProps {
  isUpdateModalOpen: boolean
  setIsUpdateModalOpen: (v: boolean) => void
  dataUpdate: any
  setDataUpdate: any
}

const PostTagUpdateModal = (props: IProps) => {
  const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate } = props;

  console.log('>>>dataUpdate: ', dataUpdate);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
  })

  useEffect(() => {
    if (dataUpdate) {
      //code
      setFormData({
        name: dataUpdate.name.trim() ?? "",
        description: dataUpdate.description.trim() ?? "",
        slug: dataUpdate.slug.trim() ?? "",
      })
    }
  }, [dataUpdate])

  const handleCloseUpdateModal = () => {
    setFormData({ name: "", description: "", slug: "" })
    setIsUpdateModalOpen(false)
    setDataUpdate(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const { name, description, slug } = formData;
      try {
        const res = await handleUpdatePostTagAction({
          id: dataUpdate.id,
          name,
          description,
          slug,
        });
        if (res?.data) {
          toast("Tag has been updated successfully.");
          handleCloseUpdateModal();
        } else {
          toast(res?.message);
        }
      } catch (error) {
        toast("Could not update tag. Please try again.");
      }
    };

  return (
    <Dialog open={isUpdateModalOpen} onOpenChange={(isOpen) => isOpen || handleCloseUpdateModal()}>
      <DialogContent
        className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Update Tag</DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Update tag information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                Tên
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                Mô tả
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">
                Slug
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseUpdateModal}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 mr-2"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white dark:text-black">
              Update Tag
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PostTagUpdateModal;

