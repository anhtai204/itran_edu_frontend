"use client"

import type React from "react"
import { useState } from "react"
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
import { handleCreateQuizLevelAction } from "@/utils/action"

interface IProps {
  isCreateModalOpen: boolean
  setIsCreateModalOpen: (v: boolean) => void
}

const QuizLevelCreateModal = ({ isCreateModalOpen, setIsCreateModalOpen }: IProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const handleCloseCreateModal = () => {
    setFormData({ name: "", description: "" })
    setIsCreateModalOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { name, description } = formData
    try {
      const res = await handleCreateQuizLevelAction({ name, description })
      if (res?.data) {
        toast("New level has been created successfully.")
        handleCloseCreateModal()
      } else {
        toast(res?.message)
      }
    } catch (error) {
      toast("Could not create level. Please try again.")
    }
  }

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={(isOpen) => isOpen || handleCloseCreateModal()}>
      <DialogContent
        className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Quiz Level</DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Fill in the information below to create a new quiz level.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Tên
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                Mô tả
              </Label>
              <Input
                id="description"
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseCreateModal}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 mr-2"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white dark:text-black">
              Create Level
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default QuizLevelCreateModal;

