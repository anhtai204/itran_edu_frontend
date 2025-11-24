"use client"

import React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  
  const generatePageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push("...")
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1)
        pageNumbers.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        pageNumbers.push(1)
        pageNumbers.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push("...")
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  return (
    <nav className="flex items-center space-x-2">
      <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft className="h-4 w-4 dark:text-white" />
        <span className="sr-only">Previous Page</span>
      </Button>
      {generatePageNumbers().map((pageNumber, index) => (
        <React.Fragment key={index}>
          {pageNumber === "..." ? (
            <Button variant="outline" size="icon" disabled>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant={currentPage === pageNumber ? "default" : "outline"}
              size="icon"
              // className="dark:text-gray-950 dark:hover:bg-gray-800"
              className={`dark:hover:bg-gray-800 ${
                currentPage === pageNumber ? "dark:text-gray-950" : "dark:text-white"
              }`}
              onClick={() => onPageChange(pageNumber as number)}
            >
              {pageNumber}
            </Button>
          )}
        </React.Fragment>
      ))}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4 dark:text-white" />
        <span className="sr-only">Next Page</span>
      </Button>
    </nav>
  )
}

