import AnalysisUtility from "@/components/analysis/analysis-utility"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Data Analysis - iTach Edu",
  description: "Powerful data analysis tools and statistical insights",
}

export default function AnalysisPage() {
  return <AnalysisUtility />
}
