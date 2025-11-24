"use client"
import { Check } from "lucide-react"
import type { Plan } from "@/types/pricing"
import PricingCard from "@/components/pricing/pricing-card"

interface PricingPlansProps {
  plans: Plan[]
  billingCycle: "monthly" | "annual"
  onBillingCycleChange: (cycle: "monthly" | "annual") => void
}

export default function PricingPlans({ plans, billingCycle, onBillingCycleChange }: PricingPlansProps) {
  return (
    <div className="space-y-8">
      {/* Billing toggle */}
      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={() => onBillingCycleChange("monthly")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            billingCycle === "monthly"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Monthly
        </button>
        <div className="relative">
          <button
            onClick={() => onBillingCycleChange("annual")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              billingCycle === "annual"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Annual
          </button>
          {billingCycle === "annual" && (
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          )}
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} billingCycle={billingCycle} />
        ))}
      </div>

      {/* Guarantee */}
      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
          <Check className="h-4 w-4 text-green-500" />
          30-day money-back guarantee
        </p>
      </div>
    </div>
  )
}
