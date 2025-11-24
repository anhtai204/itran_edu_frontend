import type { Metadata } from "next"
import FAQPage from "@/components/faq/faq-page"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Itran Education",
  description: "Find answers to commonly asked questions about our platform, courses, and services.",
}

export default function FAQ() {
  return <FAQPage />
}
