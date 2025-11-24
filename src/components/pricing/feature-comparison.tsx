"use client"

import { useState } from "react"
import { Check, X, ChevronDown } from "lucide-react"
import type { Plan, FeatureCategory } from "@/types/pricing"
import React from "react"

interface FeatureComparisonProps {
  plans: Plan[]
  features: FeatureCategory[]
  billingCycle: "monthly" | "annual"
}

export default function FeatureComparison({ plans, features, billingCycle }: FeatureComparisonProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(features.map((category) => category.id))

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Feature Comparison</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 min-w-[200px]">Features</th>
              {plans.map((plan) => (
                <th key={plan.id} className="p-4 text-center min-w-[140px]">
                  <div className="font-semibold">{plan.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    ${billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice}
                    <span className="text-xs">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((category) => (
              <React.Fragment key={category.id}>
                <tr className="bg-muted/50">
                  <td
                    className="p-4 font-medium cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center justify-between">
                      {category.name}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expandedCategories.includes(category.id) ? "transform rotate-180" : ""
                        }`}
                      />
                    </div>
                  </td>
                  {plans.map((plan) => (
                    <td key={`${category.id}-${plan.id}`} className="p-4 text-center"></td>
                  ))}
                </tr>
                {expandedCategories.includes(category.id) &&
                  category.features.map((feature) => (
                    <tr key={feature.id} className="border-b">
                      <td className="p-4 pl-8 text-sm">{feature.name}</td>
                      {plans.map((plan) => {
                        const planFeature = feature.availability[plan.id]
                        return (
                          <td key={`${feature.id}-${plan.id}`} className="p-4 text-center">
                            {planFeature === true ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : planFeature === false ? (
                              <X className="h-5 w-5 text-muted-foreground mx-auto" />
                            ) : (
                              <span className="text-xs">{planFeature}</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
