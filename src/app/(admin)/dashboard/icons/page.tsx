import type { Metadata } from "next"
import IconsPage from "@/components/icons/icons-page"

export const metadata: Metadata = {
  title: "Icons Library | Itran Education",
  description: "Browse and use icons from popular icon libraries",
}

export default function Icons() {
  return <IconsPage />
}
