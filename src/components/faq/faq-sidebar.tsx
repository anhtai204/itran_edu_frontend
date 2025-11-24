"use client"

import { cn } from "@/lib/utils"
import type { FAQCategory } from "@/types/faq"

interface FAQSidebarProps {
  categories: FAQCategory[]
  activeCategory: string
  setActiveCategory: (category: string) => void
  searchQuery: string
}

export default function FAQSidebar({ categories, activeCategory, setActiveCategory, searchQuery }: FAQSidebarProps) {
  // If search is active, don't highlight any category
  const isSearchActive = searchQuery.trim() !== ""

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <nav>
        <ul className="space-y-1">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  activeCategory === category.id && !isSearchActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-foreground/70",
                )}
                aria-current={activeCategory === category.id && !isSearchActive ? "page" : undefined}
              >
                {category.name}
                <span className="ml-2 text-xs text-muted-foreground">({category.faqs.length})</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
