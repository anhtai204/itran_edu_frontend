import FormsUtility from "@/components/forms/forms-utility"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Forms Utility - Create and Manage Forms",
  description: "Create, edit, and manage forms with our powerful form builder utility.",
}

export default function FormsPage() {
  return <FormsUtility />
}
