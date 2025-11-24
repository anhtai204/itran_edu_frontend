"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import IconGrid from "./icon-grid"
import IconPreview from "./icon-preview"
import type { IconLibrary, IconCategory, IconSize, IconCollection } from "@/types/icons"
import { iconCollections } from "@/data/icon-collections"

export default function IconsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLibrary, setSelectedLibrary] = useState<IconLibrary>("all")
  const [selectedCategory, setSelectedCategory] = useState<IconCategory>("all")
  const [iconSize, setIconSize] = useState<IconSize>("medium")
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [filteredIcons, setFilteredIcons] = useState<IconCollection[]>(iconCollections)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Filter icons based on search query, library, and category
  useEffect(() => {
    let filtered = [...iconCollections]

    if (selectedLibrary !== "all") {
      filtered = filtered.filter((icon) => icon.library === selectedLibrary)
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((icon) => icon.categories.includes(selectedCategory as Exclude<IconCategory, "all">))
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (icon) => icon.name.toLowerCase().includes(query) || icon.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    setFilteredIcons(filtered)
  }, [searchQuery, selectedLibrary, selectedCategory])

  // Get unique categories from all icons
  const allCategories = Array.from(new Set(iconCollections.flatMap((icon) => icon.categories))) as Exclude<
    IconCategory,
    "all"
  >[]

  const handleIconClick = (iconId: string) => {
    setSelectedIcon(iconId)
    setIsPreviewOpen(true)
  }

  const closePreview = () => {
    setIsPreviewOpen(false)
    setSelectedIcon(null)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Icon Library</h1>

      <Tabs defaultValue="browse" className="mb-6">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="browse">Browse Icons</TabsTrigger>
          <TabsTrigger value="custom">Custom Icons</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search icons by name or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedLibrary} onValueChange={(value) => setSelectedLibrary(value as IconLibrary)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select Library" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Libraries</SelectItem>
                  <SelectItem value="heroicons">Heroicons</SelectItem>
                  <SelectItem value="lucide">Lucide</SelectItem>
                  <SelectItem value="material">Material Icons</SelectItem>
                  <SelectItem value="fontawesome">Font Awesome</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as IconCategory)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {allCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={iconSize} onValueChange={(value) => setIconSize(value as IconSize)}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Icon Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{filteredIcons.length} icons found</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Copy Selected
              </Button>
              <Button variant="outline" size="sm">
                Download Selected
              </Button>
            </div>
          </div>

          <IconGrid icons={filteredIcons} size={iconSize} onIconClick={handleIconClick} />
        </TabsContent>

        <TabsContent value="custom">
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-medium mb-2">Upload Custom Icons</h3>
            <p className="text-muted-foreground mb-4">Upload your own SVG icons to use in your projects</p>
            <Button>Upload SVG Icons</Button>
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-medium mb-2">Your Favorite Icons</h3>
            <p className="text-muted-foreground mb-4">You haven't added any icons to your favorites yet</p>
            <Button variant="outline">Browse Icons</Button>
          </div>
        </TabsContent>
      </Tabs>

      {isPreviewOpen && selectedIcon && (
        <IconPreview iconId={selectedIcon} onClose={closePreview} collections={iconCollections} />
      )}
    </div>
  )
}
