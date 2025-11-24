import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQs() {
  const faqs = [
    {
      question: "What Does Royalty Free Mean?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis eu, adipiscing facilisis. Urna, donec turpis egestas vulputat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in.",
    },
    {
      question: "What Does Royalty Free Mean?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis eu, adipiscing facilisis. Urna, donec turpis egestas vulputat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in.",
    },
    {
      question: "What Does Royalty Free Mean?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis eu, adipiscing facilisis. Urna, donec turpis egestas vulputat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in.",
    },
    {
      question: "What Does Royalty Free Mean?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis eu, adipiscing facilisis. Urna, donec turpis egestas vulputat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in.",
    },
  ]

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, i) => (
        <AccordionItem key={i} value={`faq-${i}`} className="border-b border-gray-200 dark:border-gray-700">
          <AccordionTrigger className="text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 dark:text-gray-300">{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}