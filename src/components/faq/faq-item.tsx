"use client"

import { useState } from "react"
import type { FAQ } from "@/types/faq"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface FAQItemProps {
  faq: FAQ
}

export default function FAQItem({ faq }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex justify-between items-center w-full p-4 text-left",
          "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary",
          isOpen ? "bg-accent" : "hover:bg-muted",
        )}
        aria-expanded={isOpen}
      >
        <h3 className="font-medium text-lg">{faq.question}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 bg-card border-t">
              <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: faq.answer }} />

              {faq.relatedLinks && faq.relatedLinks.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium text-sm">Related Resources:</p>
                  <ul className="mt-2 space-y-1">
                    {faq.relatedLinks.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.url}
                          className="text-primary hover:underline text-sm"
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noopener noreferrer" : undefined}
                        >
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
