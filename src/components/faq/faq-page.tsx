"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FAQCategory from "./faq-category"
import FAQSidebar from "./faq-sidebar"
import { faqData } from "@/data/faq-data"
import { Search } from "lucide-react"

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("general")

  // Filter FAQs based on search query
  const filteredFAQs =
    searchQuery.trim() === ""
      ? faqData
      : faqData
          .map((category) => ({
            ...category,
            faqs: category.faqs.filter(
              (faq) =>
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
          }))
          .filter((category) => category.faqs.length > 0)

  // Handle category change from sidebar
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="search"
          placeholder="Search for questions or answers..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <FAQSidebar
            categories={faqData}
            activeCategory={activeCategory}
            setActiveCategory={handleCategoryChange}
            searchQuery={searchQuery}
          />
        </div>

        <div className="md:col-span-3">
          {searchQuery.trim() === "" ? (
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="hidden">
                {faqData.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {faqData.map((category) => (
                <TabsContent key={category.id} value={category.id} forceMount={true}>
                  {activeCategory === category.id && <FAQCategory category={category} />}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-6">Search Results</h2>
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-lg text-gray-500">No results found for "{searchQuery}"</p>
                  <p className="text-sm text-gray-400 mt-2">Try using different keywords or browse categories</p>
                </div>
              ) : (
                filteredFAQs.map((category) => (
                  <div key={category.id} className="mb-8">
                    <h3 className="text-lg font-medium mb-4">{category.name}</h3>
                    <FAQCategory category={category} />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
