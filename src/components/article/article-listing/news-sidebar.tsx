import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

// Mock data
const categories = [
  { id: "announcements", name: "Announcements", count: 12 },
  { id: "events", name: "Events", count: 8 },
  { id: "partnerships", name: "Partnerships", count: 5 },
  { id: "success-stories", name: "Success Stories", count: 15 },
  { id: "updates", name: "Updates", count: 20 },
  { id: "webinars", name: "Webinars", count: 7 },
];

const archives = [
  { month: "March 2025", count: 18 },
  { month: "February 2025", count: 15 },
  { month: "January 2025", count: 22 },
  { month: "December 2024", count: 17 },
  { month: "November 2024", count: 14 },
];

interface NewsSidebarProps {
  className?: string;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  categories: Category[];
}

interface Category {
  id: string;
  name: string;
  count: number;
}

export function NewsSidebar({
  categories,
  className = "",
  selectedCategory,
  onCategorySelect,
}: NewsSidebarProps) {
  return (
    <div className={`w-full md:w-64 space-y-8 ${className}`}>
      <div>
        <h3 className="text-sm font-semibold mb-4">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategory === category.id}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onCategorySelect(category.id);
                  } else if (selectedCategory === category.name) {
                    onCategorySelect(null);
                  }
                }}
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="flex-1 cursor-pointer text-xs flex justify-between"
              >
                <span>{category.name}</span>
                <span className="text-gray-500 dark:text-gray-400">
                  ({category.count})
                </span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-xs font-semibold mb-4">Archives</h3>
        <div className="space-y-2">
          {archives.map((archive) => (
            <Button
              key={archive.month}
              variant="ghost"
              className="w-full justify-start text-sm h-auto py-2"
            >
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-xs flex-1 text-left">{archive.month}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({archive.count})
              </span>
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 p-4 rounded-lg">
        <h3 className="text-xs font-semibold mb-2">Newsletter</h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-4">
          Subscribe to our newsletter to get the latest news directly to your
          inbox.
        </p>
        <Button className="text-xs w-full bg-indigo-600 hover:bg-indigo-700">
          Subscribe Now
        </Button>
      </div>
    </div>
  );
}