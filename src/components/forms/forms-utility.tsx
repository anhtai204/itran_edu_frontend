"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, FileText, Settings, Eye } from "lucide-react"
import FormBuilder from "./form-builder"
import FormList from "./form-list"
import FormPreview from "./form-preview"
import FormSettings from "./form-settings"

export default function FormsUtility() {
  const [activeTab, setActiveTab] = useState("builder")
  const [selectedForm, setSelectedForm] = useState<any>(null)

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Forms Utility</h1>
        <p className="text-muted-foreground">Create, manage, and deploy forms with our powerful form builder tool.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Form Builder
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            My Forms
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <FormBuilder onFormSelect={setSelectedForm} />
        </TabsContent>

        <TabsContent value="list">
          <FormList onFormSelect={setSelectedForm} />
        </TabsContent>

        <TabsContent value="preview">
          <FormPreview form={selectedForm} />
        </TabsContent>

        <TabsContent value="settings">
          <FormSettings form={selectedForm} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
