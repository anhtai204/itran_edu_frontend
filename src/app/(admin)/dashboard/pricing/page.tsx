import type { Metadata } from "next"
import PricingPage from "@/components/pricing/pricing-page" 

export const metadata: Metadata = {
  title: "Pricing Plans | iTach Education",
  description:
    "Choose the perfect plan for your educational needs. Flexible pricing options for students, educators, and institutions.",
}

export default function Pricing() {
  return <PricingPage />
}
