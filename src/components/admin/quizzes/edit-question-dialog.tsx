"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import SingleChoiceForm from "../../quiz/question-types-root/single-choice-form-v1" 
import MultipleChoiceForm from "../../quiz/question-types-root/multiple-choice"
import TrueFalseForm from "../../quiz/question-types-root/true-false"
import MatchingForm from "../../quiz/question-types-root/matching"
import ImageMatchingForm from "../../quiz/question-types-root/image-matching"
import FillBlanksForm from "../../quiz/question-types-root/fill-blanks"

interface EditQuestionDialogProps {
  open: boolean
  onClose: () => void
  question: any
  onSave: (question: any) => void
}

export default function EditQuestionDialog({ open, onClose, question, onSave }: EditQuestionDialogProps) {

  console.log('>>>question: ', question);

  const renderForm = () => {
    switch (question.type) {
      case "single-choice":
        return <SingleChoiceForm initialData={question} onSubmit={onSave} />
      case "multiple-choice":
        return <MultipleChoiceForm initialData={question} onSubmit={onSave} />
      case "true-false":
        return <TrueFalseForm initialData={question} onSubmit={onSave} />
      case "matching":
        return <MatchingForm initialData={question} onSubmit={onSave} />
      case "image-matching":
        return <ImageMatchingForm initialData={question} onSubmit={onSave} />
      case "fill-blanks":
        return <FillBlanksForm initialData={question} onSubmit={onSave} />
      default:
        return <div>Unknown question type</div>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  )
}
