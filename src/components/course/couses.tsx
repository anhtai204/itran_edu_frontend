import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Star, X, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Pagination } from "../ui/pagination";
import { Slider } from "../ui/slider";
import { CourseCard } from "./course-listing/course-card";
import { CourseListItem } from "./course-listing/course-list-item";

// Sample data
const teachers = [
  { id: "john-doe", name: "John Doe", count: 12 },
  { id: "jane-smith", name: "Jane Smith", count: 10 },
  { id: "robert-johnson", name: "Robert Johnson", count: 8 },
  { id: "emily-davis", name: "Emily Davis", count: 7 },
  { id: "michael-wilson", name: "Michael Wilson", count: 6 },
];

const levels = [
  { id: "beginner", name: "Beginner", count: 45 },
  { id: "intermediate", name: "Intermediate", count: 32 },
  { id: "advanced", name: "Advanced", count: 18 },
  { id: "all-levels", name: "All Levels", count: 24 },
];

interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  teacher_id?: string;
  category_id?: string;
  status?: string;
  price?: number;
  duration?: number;
  slug: string;
  assistants_id?: string[];
  original_price?: number;
  featured?: boolean;
  level_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface CourseCategory {
  id: string;
  name: string;
  description?: string;
  count: number;
}

interface IProps {
  courses: Course[];
  course_categories: CourseCategory[];
  courses_meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
}

export function CourseListing(props: IProps) {
  const { courses, course_categories, courses_meta } = props;
  console.log(courses, course_categories, courses_meta);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedteachers, setSelectedteachers] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("popular");

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Toggle instructor selection
  const toggleInstructor = (instructorId: string) => {
    setSelectedteachers((prev) =>
      prev.includes(instructorId)
        ? prev.filter((id) => id !== instructorId)
        : [...prev, instructorId]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedteachers([]);
    setPriceRange([0, 100]);
    setSelectedRating(null);
    setSelectedLevel(null);
  };

  // Count active filters
  const activeFilterCount =
    selectedCategories.length +
    selectedteachers.length +
    (selectedRating ? 1 : 0) +
    (selectedLevel ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 100 ? 1 : 0);

  return (
    <>
      <div className="bg-gradient-to-b from-purple-900 to-indigo-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Our Courses
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Discover thousands of courses to help you grow your skills and
            advance your career
          </p>

          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search for courses..."
                className="pl-10 pr-4 py-6 rounded-full text-gray-800 bg-white dark:text-white dark:bg-gray-300 border-0 shadow-lg"
              />
              <Button className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar - Mobile Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid" ? "bg-purple-600 hover:bg-purple-700" : ""
                }
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list" ? "bg-purple-600 hover:bg-purple-700" : ""
                }
              >
                <List className="h-4 w-4" />
              </Button>

              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filter Sidebar */}
          <div
            className={`lg:w-1/4 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-6 ${
              isFilterOpen ? "block" : "hidden lg:block"
            } ${
              isFilterOpen
                ? "fixed inset-0 z-40 overflow-auto lg:static lg:z-0"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Filters</h2>
              {isFilterOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFilterOpen(false)}
                  className="lg:hidden"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
              {activeFilterCount > 0 && (
                <Button
                  variant="link"
                  onClick={clearFilters}
                  className="text-purple-600 dark:text-purple-400 p-0 h-auto"
                >
                  Clear all
                </Button>
              )}
            </div>

            <Accordion
              type="multiple"
              defaultValue={[
                "category",
                "instructor",
                "price",
                "rating",
                "level",
              ]}
              className="space-y-4"
            >
              {/* Category Filter */}
              <AccordionItem
                value="category"
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <AccordionTrigger className="text-base font-medium py-2">
                  Course Category
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {course_categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="text-sm flex-1 flex justify-between items-center cursor-pointer"
                        >
                          <span>{category.name}</span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs">
                            ({category.count})
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Instructor Filter */}
              <AccordionItem
                value="instructor"
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <AccordionTrigger className="text-base font-medium py-2">
                  Teachers
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {teachers.map((instructor) => (
                      <div
                        key={instructor.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`instructor-${instructor.id}`}
                          checked={selectedteachers.includes(instructor.id)}
                          onCheckedChange={() =>
                            toggleInstructor(instructor.id)
                          }
                        />
                        <label
                          htmlFor={`instructor-${instructor.id}`}
                          className="text-sm flex-1 flex justify-between items-center cursor-pointer"
                        >
                          <span>{instructor.name}</span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs">
                            ({instructor.count})
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Price Filter */}
              <AccordionItem
                value="price"
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <AccordionTrigger className="text-base font-medium py-2">
                  Price
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 pt-2">
                    <Slider
                      defaultValue={[0, 100]}
                      max={100}
                      step={1}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="py-4"
                    />
                    <div className="flex items-center justify-between">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-md px-3 py-1">
                        <span className="text-sm">${priceRange[0]}</span>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-md px-3 py-1">
                        <span className="text-sm">${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Rating Filter */}
              <AccordionItem
                value="rating"
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <AccordionTrigger className="text-base font-medium py-2">
                  Rating
                </AccordionTrigger>
                <AccordionContent>
                  <RadioGroup
                    value={selectedRating?.toString() || ""}
                    onValueChange={(value) =>
                      setSelectedRating(Number.parseInt(value) || null)
                    }
                  >
                    <div className="space-y-2 pt-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div
                          key={rating}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={rating.toString()}
                            id={`rating-${rating}`}
                          />
                          <label
                            htmlFor={`rating-${rating}`}
                            className="text-sm flex items-center cursor-pointer"
                          >
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-2">
                              {rating === 5 ? "& up" : `& up`}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>

              {/* Level Filter */}
              <AccordionItem
                value="level"
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <AccordionTrigger className="text-base font-medium py-2">
                  Level
                </AccordionTrigger>
                <AccordionContent>
                  <RadioGroup
                    value={selectedLevel || ""}
                    onValueChange={setSelectedLevel}
                  >
                    <div className="space-y-2 pt-2">
                      {levels.map((level) => (
                        <div
                          key={level.id}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={level.id}
                            id={`level-${level.id}`}
                          />
                          <label
                            htmlFor={`level-${level.id}`}
                            className="text-sm flex-1 flex justify-between items-center cursor-pointer"
                          >
                            <span>{level.name}</span>
                            <span className="text-gray-500 dark:text-gray-400 text-xs">
                              ({level.count})
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {isFilterOpen && (
              <div className="mt-6 lg:hidden">
                <Button
                  className="w-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            )}
          </div>

          {/* Course Listing */}
          <div className="lg:w-3/4">
            {/* Desktop Sort and View Options */}
            <div className="hidden lg:flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  Showing <span className="font-medium">{1}</span> results
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={
                      viewMode === "grid"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : ""
                    }
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={
                      viewMode === "list"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : ""
                    }
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map((categoryId) => {
                  const category = course_categories.find(
                    (c) => c.id === categoryId
                  );
                  return category ? (
                    <div
                      key={categoryId}
                      className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full px-3 py-1 text-sm flex items-center"
                    >
                      <span>Category: {category.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1 hover:bg-transparent"
                        onClick={() => toggleCategory(categoryId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : null;
                })}

                {selectedteachers.map((instructorId) => {
                  const instructor = teachers.find(
                    (i) => i.id === instructorId
                  );
                  return instructor ? (
                    <div
                      key={instructorId}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1 text-sm flex items-center"
                    >
                      <span>Instructor: {instructor.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1 hover:bg-transparent"
                        onClick={() => toggleInstructor(instructorId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : null;
                })}

                {(priceRange[0] > 0 || priceRange[1] < 100) && (
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full px-3 py-1 text-sm flex items-center">
                    <span>
                      Price: ${priceRange[0]} - ${priceRange[1]}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1 hover:bg-transparent"
                      onClick={() => setPriceRange([0, 100])}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {selectedRating && (
                  <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full px-3 py-1 text-sm flex items-center">
                    <span>Rating: {selectedRating}+ stars</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1 hover:bg-transparent"
                      onClick={() => setSelectedRating(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {selectedLevel && (
                  <div className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full px-3 py-1 text-sm flex items-center">
                    <span>
                      Level: {levels.find((l) => l.id === selectedLevel)?.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1 hover:bg-transparent"
                      onClick={() => setSelectedLevel(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Course Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <CourseListItem key={course.id} course={course} />
                ))}
              </div>
            )}

            {/* Pagination */}

            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="w-10 h-10 p-0 rounded-full"
                  disabled
                >
                  &lt;
                </Button>
                <Button
                  variant="default"
                  className="w-10 h-10 p-0 rounded-full bg-purple-600 hover:bg-purple-700"
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  className="w-10 h-10 p-0 rounded-full"
                >
                  2
                </Button>
                <Button
                  variant="outline"
                  className="w-10 h-10 p-0 rounded-full"
                >
                  3
                </Button>
                <Button
                  variant="outline"
                  className="w-10 h-10 p-0 rounded-full"
                >
                  &gt;
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}