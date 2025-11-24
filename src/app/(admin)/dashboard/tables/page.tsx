import TablesUtility from "@/components/tables/tables-utility"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tables Utility - Create and Manage Tables",
  description: "Create, edit, and manage tables with our powerful table builder utility.",
}

export default function TablesPage() {
  return <TablesUtility />
}
