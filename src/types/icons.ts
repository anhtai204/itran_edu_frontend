export type IconLibrary = "all" | "heroicons" | "lucide" | "material" | "fontawesome"
export type IconCategory =
  | "all"
  | "ui"
  | "media"
  | "arrows"
  | "communication"
  | "devices"
  | "finance"
  | "weather"
  | "shapes"
  | "editor"
  | "education"
export type IconSize = "small" | "medium" | "large"

export interface IconCollection {
  id: string
  name: string
  svg: string
  library: Exclude<IconLibrary, "all">
  categories: Exclude<IconCategory, "all">[]
  tags: string[]
}
