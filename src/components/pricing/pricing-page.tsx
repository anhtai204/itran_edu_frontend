"use client"

import { useState } from "react"
import PricingPlans from "./pricing-plans"
import FeatureComparison from "./feature-comparison"
import PricingFAQ from "./pricing-faq" 
import Testimonials from "./testimonials"
import { pricingData } from "@/data/pricing-data"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")

  const handleBillingCycleChange = (cycle: "monthly" | "annual") => {
    setBillingCycle(cycle)
  }

  return (
    <div className="container mx-auto px-4 py-16 space-y-20">
      {/* Hero section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">Choose the Perfect Plan for Your Educational Journey</h1>
        <p className="text-xl text-muted-foreground">
          Flexible pricing options designed for students, educators, and institutions of all sizes.
        </p>
      </div>

      {/* Pricing plans */}
      <PricingPlans
        plans={pricingData.plans}
        billingCycle={billingCycle}
        onBillingCycleChange={handleBillingCycleChange}
      />

      {/* Feature comparison */}
      <FeatureComparison plans={pricingData.plans} features={pricingData.features} billingCycle={billingCycle} />

      {/* Testimonials */}
      <Testimonials testimonials={pricingData.testimonials} />

      {/* FAQ */}
      <PricingFAQ faqs={pricingData.faqs} />

      {/* CTA section */}
      <div className="text-center bg-muted p-10 rounded-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
        <p className="text-muted-foreground mb-6">
          Contact our sales team for a personalized consultation and discover how we can meet your specific needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Contact Sales
          </a>
          <a
            href="/demo"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Request Demo
          </a>
        </div>
      </div>
    </div>
  )
}
