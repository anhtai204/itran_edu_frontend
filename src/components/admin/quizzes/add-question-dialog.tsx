"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SingleChoiceForm from "../../quiz/question-types-root/single-choice-form-v1"
import MultipleChoiceForm from "../../quiz/question-types-root/multiple-choice"
import TrueFalseForm from "../../quiz/question-types-root/true-false"
import MatchingForm from "../../quiz/question-types-root/matching"
import ImageMatchingForm from "../../quiz/question-types-root/image-matching"
import FillBlanksForm from "../../quiz/question-types-root/fill-blanks"

interface AddQuestionDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (question: any) => void
}

export default function AddQuestionDialog({ open, onClose, onAdd }: AddQuestionDialogProps) {
  const [activeTab, setActiveTab] = useState("single-choice")

  const handleAddQuestion = (question: any) => {
    onAdd({
      ...question,
      type: activeTab,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
            <TabsTrigger value="single-choice">Single Choice</TabsTrigger>
            <TabsTrigger value="multiple-choice">Multiple Choice</TabsTrigger>
            <TabsTrigger value="true-false">True/False</TabsTrigger>
            <TabsTrigger value="matching">Matching</TabsTrigger>
            <TabsTrigger value="image-matching">Image Matching</TabsTrigger>
            <TabsTrigger value="fill-blanks">Fill in Blanks</TabsTrigger>
          </TabsList>

          <TabsContent value="single-choice" className="mt-4">
            <SingleChoiceForm onSubmit={handleAddQuestion} />
          </TabsContent>

          <TabsContent value="multiple-choice" className="mt-4">
            <MultipleChoiceForm onSubmit={handleAddQuestion} />
          </TabsContent>

          <TabsContent value="true-false" className="mt-4">
            <TrueFalseForm onSubmit={handleAddQuestion} />
          </TabsContent>

          <TabsContent value="matching" className="mt-4">
            <MatchingForm onSubmit={handleAddQuestion} />
          </TabsContent>

          <TabsContent value="image-matching" className="mt-4">
            <ImageMatchingForm onSubmit={handleAddQuestion} />
          </TabsContent>

          <TabsContent value="fill-blanks" className="mt-4">
            <FillBlanksForm onSubmit={handleAddQuestion} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
