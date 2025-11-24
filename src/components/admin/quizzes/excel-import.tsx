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
import { Download, AlertCircle, CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ExcelImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportComplete: (questions: any[]) => void
}

export default function ExcelImport({ open, onOpenChange, onImportComplete }: ExcelImportProps) {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleImport = () => {
    if (!file) {
      setError("Please select a file to import")
      return
    }

    // Check file extension
    const fileExt = file.name.split(".").pop()?.toLowerCase()
    if (fileExt !== "xlsx" && fileExt !== "xls") {
      setError("Please upload an Excel file (.xlsx or .xls)")
      return
    }

    setImporting(true)
    setProgress(0)
    setError(null)

    // Simulate import process
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setImporting(false)
          setSuccess(true)

          // Mock imported questions
          const mockImportedQuestions = [
            {
              id: `question-${Date.now()}-1`,
              type: "single-choice",
              text: "What is the capital of France?",
              options: [
                { id: "1", text: "London", isCorrect: false },
                { id: "2", text: "Berlin", isCorrect: false },
                { id: "3", text: "Paris", isCorrect: true },
                { id: "4", text: "Madrid", isCorrect: false },
              ],
              explanation: "Paris is the capital of France.",
              points: 1,
            },
            {
              id: `question-${Date.now()}-2`,
              type: "multiple-choice",
              text: "Which of the following are JavaScript frameworks?",
              options: [
                { id: "1", text: "React", isCorrect: true },
                { id: "2", text: "Angular", isCorrect: true },
                { id: "3", text: "Java", isCorrect: false },
                { id: "4", text: "Vue", isCorrect: true },
              ],
              explanation: "React, Angular, and Vue are JavaScript frameworks.",
              points: 2,
            },
            {
              id: `question-${Date.now()}-3`,
              type: "true-false",
              text: "HTML is a programming language.",
              options: [
                { id: "1", text: "True", isCorrect: false },
                { id: "2", text: "False", isCorrect: true },
              ],
              explanation: "HTML is a markup language, not a programming language.",
              points: 1,
            },
          ]

          setTimeout(() => {
            onImportComplete(mockImportedQuestions)
          }, 1000)

          return 100
        }
        return prev + 10
      })
    }, 300)

    return () => clearInterval(interval)
  }

  const handleDownloadTemplate = () => {
    // In a real application, this would download an Excel template
    console.log("Downloading template...")
  }

  const resetState = () => {
    setFile(null)
    setImporting(false)
    setProgress(0)
    setError(null)
    setSuccess(false)
  }

  const handleClose = () => {
    resetState()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Questions from Excel</DialogTitle>
          <DialogDescription>Upload an Excel file with your questions to import them into your quiz.</DialogDescription>
        </DialogHeader>

        {!success ? (
          <>
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="excel-template">Excel Template</Label>
                  <p className="text-sm text-muted-foreground">Download our template for the correct format</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handleDownloadTemplate}
                >
                  <Download size={16} />
                  Template
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excel-file">Upload Excel File</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="excel-file"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    disabled={importing}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Supported formats: .xlsx, .xls</p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {importing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Importing questions...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={importing}>
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={!file || importing}>
                {importing ? "Importing..." : "Import Questions"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
              <h3 className="text-lg font-medium">Import Successful</h3>
              <p className="text-sm text-muted-foreground mt-1">3 questions have been successfully imported</p>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
