import type { FAQCategory } from "@/types/faq"
import FAQItem from "@/components/faq/faq-item"

interface FAQCategoryProps {
  category: FAQCategory
}

export default function FAQCategory({ category }: FAQCategoryProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">{category.name}</h2>
      <div className="space-y-4">
        {category.faqs.map((faq, index) => (
          <FAQItem key={index} faq={faq} />
        ))}
      </div>
    </div>
  )
}
