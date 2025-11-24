"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import type { PricingFAQ } from "@/types/pricing"

interface PricingFAQProps {
  faqs: PricingFAQ[]
}

export default function PricingFAQ({ faqs }: PricingFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <button
              className="flex items-center justify-between w-full p-4 text-left font-medium focus:outline-none"
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
            >
              {faq.question}
              <ChevronDown
                className={`h-5 w-5 transition-transform ${openIndex === index ? "transform rotate-180" : ""}`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-96" : "max-h-0"}`}
            >
              <div className="p-4 pt-0 text-muted-foreground">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
