"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, GripVertical, Type, Mail, Phone, Calendar, FileText, CheckSquare, Radio } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface FormField {
  id: string
  type: string
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
}

interface FormBuilderProps {
  onFormSelect: (form: any) => void
}

const fieldTypes = [
  { value: "text", label: "Text Input", icon: Type },
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "date", label: "Date", icon: Calendar },
  { value: "textarea", label: "Textarea", icon: FileText },
  { value: "select", label: "Select", icon: CheckSquare },
  { value: "radio", label: "Radio", icon: Radio },
  { value: "checkbox", label: "Checkbox", icon: CheckSquare },
]

export default function FormBuilder({ onFormSelect }: FormBuilderProps) {
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [fields, setFields] = useState<FormField[]>([])
  const [selectedField, setSelectedField] = useState<FormField | null>(null)

  const addField = (type: string) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `New ${type} field`,
      placeholder: "",
      required: false,
      options: type === "select" || type === "radio" ? ["Option 1", "Option 2"] : undefined,
    }
    setFields([...fields, newField])
    setSelectedField(newField)
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
    if (selectedField?.id === id) {
      setSelectedField({ ...selectedField, ...updates })
    }
  }

  const deleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id))
    if (selectedField?.id === id) {
      setSelectedField(null)
    }
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(fields)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setFields(items)
  }

  const saveForm = () => {
    const form = {
      id: `form_${Date.now()}`,
      title: formTitle,
      description: formDescription,
      fields,
      createdAt: new Date().toISOString(),
      responses: 0,
    }

    // Save to localStorage for demo
    const savedForms = JSON.parse(localStorage.getItem("forms") || "[]")
    savedForms.push(form)
    localStorage.setItem("forms", JSON.stringify(savedForms))

    onFormSelect(form)
    alert("Form saved successfully!")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form Builder */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Form Details</CardTitle>
            <CardDescription>Set up your form title and description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="mb-2">Form Title</Label>
              <Input
                id="title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Enter form title"
              />
            </div>
            <div>
              <Label htmlFor="description" className="mb-2">Description</Label>
              <Textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Enter form description"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form Fields</CardTitle>
            <CardDescription>Drag and drop to reorder fields</CardDescription>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="fields">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {fields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`p-4 border rounded-lg flex items-center gap-3 ${
                              selectedField?.id === field.id ? "border-primary bg-primary/5" : "border-border"
                            }`}
                          >
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1" onClick={() => setSelectedField(field)}>
                              <div className="font-medium">{field.label}</div>
                              <div className="text-sm text-muted-foreground capitalize">
                                {field.type}{" "}
                                {field.required && (
                                  <Badge variant="secondary" className="ml-2">
                                    Required
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => deleteField(field.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {fields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No fields added yet. Add fields from the panel on the right.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={saveForm} disabled={!formTitle || fields.length === 0}>
            Save Form
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setFormTitle("")
              setFormDescription("")
              setFields([])
              setSelectedField(null)
            }}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Add Fields */}
        <Card>
          <CardHeader>
            <CardTitle>Add Fields</CardTitle>
            <CardDescription>Click to add field types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {fieldTypes.map((type) => {
              const Icon = type.icon
              return (
                <Button
                  key={type.value}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addField(type.value)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {type.label}
                </Button>
              )
            })}
          </CardContent>
        </Card>

        {/* Field Properties */}
        {selectedField && (
          <Card>
            <CardHeader>
              <CardTitle>Field Properties</CardTitle>
              <CardDescription>Configure the selected field</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="field-label">Label</Label>
                <Input
                  id="field-label"
                  value={selectedField.label}
                  onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="field-placeholder">Placeholder</Label>
                <Input
                  id="field-placeholder"
                  value={selectedField.placeholder || ""}
                  onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="field-required"
                  checked={selectedField.required}
                  onCheckedChange={(checked) => updateField(selectedField.id, { required: checked })}
                />
                <Label htmlFor="field-required">Required field</Label>
              </div>

              {(selectedField.type === "select" || selectedField.type === "radio") && (
                <div>
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {selectedField.options?.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(selectedField.options || [])]
                            newOptions[index] = e.target.value
                            updateField(selectedField.id, { options: newOptions })
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newOptions = selectedField.options?.filter((_, i) => i !== index)
                            updateField(selectedField.id, { options: newOptions })
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newOptions = [
                          ...(selectedField.options || []),
                          `Option ${(selectedField.options?.length || 0) + 1}`,
                        ]
                        updateField(selectedField.id, { options: newOptions })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
