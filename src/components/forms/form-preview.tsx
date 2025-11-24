"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"

interface FormPreviewProps {
  form: any
}

export default function FormPreview({ form }: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})

  if (!form) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-muted-foreground">Select a form to preview it here.</div>
        </CardContent>
      </Card>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Form submitted successfully! (This is a preview)")
  }

  const renderField = (field: any) => {
    const commonProps = {
      id: field.id,
      required: field.required,
    }

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
        return (
          <Input
            {...commonProps}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.id] || ""}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
          />
        )

      case "date":
        return (
          <Input
            {...commonProps}
            type="date"
            value={formData[field.id] || ""}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
          />
        )

      case "textarea":
        return (
          <Textarea
            {...commonProps}
            placeholder={field.placeholder}
            value={formData[field.id] || ""}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
          />
        )

      case "select":
        return (
          <Select
            value={formData[field.id] || ""}
            onValueChange={(value) => setFormData({ ...formData, [field.id]: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string, index: number) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "radio":
        return (
          <RadioGroup
            value={formData[field.id] || ""}
            onValueChange={(value) => setFormData({ ...formData, [field.id]: value })}
          >
            {field.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}_${index}`} />
                <Label htmlFor={`${field.id}_${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={formData[field.id] || false}
              onCheckedChange={(checked) => setFormData({ ...formData, [field.id]: checked })}
            />
            <Label htmlFor={field.id}>{field.placeholder || "Check this box"}</Label>
          </div>
        )

      default:
        return <div>Unsupported field type: {field.type}</div>
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Form Preview</CardTitle>
          <CardDescription>This is how your form will appear to users</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">{form.title}</h2>
              {form.description && <p className="text-muted-foreground mt-2">{form.description}</p>}
            </div>

            {form.fields.map((field: any) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="flex items-center gap-2">
                  {field.label}
                  {field.required && (
                    <Badge variant="destructive" className="text-xs">
                      Required
                    </Badge>
                  )}
                </Label>
                {renderField(field)}
              </div>
            ))}

            <Button type="submit" className="w-full">
              Submit Form
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Form Information</CardTitle>
          <CardDescription>Details about this form</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Form ID</Label>
            <div className="text-sm text-muted-foreground">{form.id}</div>
          </div>

          <div>
            <Label className="text-sm font-medium">Created</Label>
            <div className="text-sm text-muted-foreground">{new Date(form.createdAt).toLocaleString()}</div>
          </div>

          <div>
            <Label className="text-sm font-medium">Fields</Label>
            <div className="text-sm text-muted-foreground">{form.fields.length} fields</div>
          </div>

          <div>
            <Label className="text-sm font-medium">Responses</Label>
            <div className="text-sm text-muted-foreground">{form.responses} responses</div>
          </div>

          <div>
            <Label className="text-sm font-medium">Field Types</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {[...new Set(form.fields.map((f: any) => f.type))].map((type) => (
                <Badge key={type as string} variant="outline" className="text-xs">
                  {type as string}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
