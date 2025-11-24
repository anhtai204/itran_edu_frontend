"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Table, Settings, Eye } from "lucide-react"
import TableBuilder from "./table-builder"
import TableList from "./table-list"
import TablePreview from "./table-preview"
import TableSettings from "./table-settings"

export default function TablesUtility() {
  const [activeTab, setActiveTab] = useState("builder")
  const [selectedTable, setSelectedTable] = useState<any>(null)

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Tables Utility</h1>
        <p className="text-muted-foreground">
          Create, manage, and customize tables with our powerful table builder tool.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Table Builder
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            My Tables
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
          <TableBuilder onTableSelect={setSelectedTable} />
        </TabsContent>

        <TabsContent value="list">
          <TableList onTableSelect={setSelectedTable} />
        </TabsContent>

        <TabsContent value="preview">
          <TablePreview table={selectedTable} />
        </TabsContent>

        <TabsContent value="settings">
          <TableSettings table={selectedTable} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
