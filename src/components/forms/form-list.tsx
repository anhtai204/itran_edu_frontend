"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Eye, Trash2, Copy, Download, Search } from "lucide-react"

interface FormListProps {
  onFormSelect: (form: any) => void
}

export default function FormList({ onFormSelect }: FormListProps) {
  const [forms, setForms] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem("forms") || "[]")
    setForms(savedForms)
  }, [])

  const filteredForms = forms.filter(
    (form) =>
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const deleteForm = (id: string) => {
    const updatedForms = forms.filter((form) => form.id !== id)
    setForms(updatedForms)
    localStorage.setItem("forms", JSON.stringify(updatedForms))
  }

  const duplicateForm = (form: any) => {
    const newForm = {
      ...form,
      id: `form_${Date.now()}`,
      title: `${form.title} (Copy)`,
      createdAt: new Date().toISOString(),
      responses: 0,
    }
    const updatedForms = [...forms, newForm]
    setForms(updatedForms)
    localStorage.setItem("forms", JSON.stringify(updatedForms))
  }

  const exportForm = (form: any) => {
    const dataStr = JSON.stringify(form, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `${form.title.replace(/\s+/g, "_")}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>

      {filteredForms.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-muted-foreground">
              {searchTerm
                ? "No forms found matching your search."
                : "No forms created yet. Start by building your first form!"}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredForms.map((form) => (
            <Card key={form.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{form.title}</CardTitle>
                    <CardDescription className="mt-1">{form.description || "No description"}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">{form.fields.length} fields</Badge>
                    <Badge variant="outline">{form.responses} responses</Badge>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(form.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onFormSelect(form)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => duplicateForm(form)}>
                      <Copy className="h-4 w-4" />
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => exportForm(form)}>
                      <Download className="h-4 w-4" />
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => deleteForm(form.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
