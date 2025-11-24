import type { Metadata } from "next"
import ChartsUtility from "@/components/charts/charts-utility"

export const metadata: Metadata = {
  title: "Chart Builder - iTach Edu",
  description: "Create beautiful charts and data visualizations",
}

export default function ChartsPage() {
  return <ChartsUtility />
}
