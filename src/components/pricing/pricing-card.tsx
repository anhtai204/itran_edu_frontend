import { Check } from "lucide-react"
import type { Plan } from "@/types/pricing"

interface PricingCardProps {
  plan: Plan
  billingCycle: "monthly" | "annual"
}

export default function PricingCard({ plan, billingCycle }: PricingCardProps) {
  const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice

  return (
    <div className={`rounded-lg border p-6 shadow-sm ${plan.popular ? "border-primary ring-1 ring-primary" : ""}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-0 right-0 mx-auto w-fit bg-primary px-3 py-1 text-xs font-medium text-primary-foreground rounded-full">
          Most Popular
        </div>
      )}

      <div className="relative">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>

        <div className="mt-4 flex items-baseline">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-sm font-medium text-muted-foreground ml-1">
            /{billingCycle === "monthly" ? "month" : "year"}
          </span>
        </div>

        {plan.discount && billingCycle === "annual" && (
          <p className="text-xs text-green-600 mt-1">Save ${plan.discount} with annual billing</p>
        )}

        <ul className="mt-6 space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <a
            href={plan.id === "enterprise" ? "/contact" : "/signup"}
            className={`w-full inline-flex justify-center items-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              plan.popular
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {plan.id === "enterprise" ? "Contact Sales" : "Get Started"}
          </a>
        </div>

        {plan.trial && <p className="text-xs text-center text-muted-foreground mt-3">{plan.trial}</p>}
      </div>
    </div>
  )
}
