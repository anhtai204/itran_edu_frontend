// "use client";

// import type React from "react";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Filter } from "lucide-react";
// import { useEffect, useState } from "react";
// import { handleGetCategories, handleGetDifficulties } from "@/utils/action";

// interface QuizFiltersProps {
//   filters: {
//     status: string;
//     category: string;
//     difficulty: string;
//   };
//   setFilters: React.Dispatch<
//     React.SetStateAction<{
//       status: string;
//       category: string;
//       difficulty: string;
//     }>
//   >;
// }

// const mockCategories = [
//   { label: "1", value: "Programming" },
//   { label: "2", value: "Mathematics" },
//   { label: "3", value: "Science" },
//   { label: "4", value: "Language" },
// ];

// const mockDifficulties = [
//   { id: "1", name: "Beginner" },
//   { id: "2", name: "Intermediate" },
//   { id: "3", name: "Advanced" },
// ];

// export default function QuizFilters({ filters, setFilters }: QuizFiltersProps) {
//   const resetFilters = () => {
//     setFilters({
//       status: "",
//       category: "",
//       difficulty: "",
//     });
//   };

//   const [categories, setCategories] = useState(mockCategories);
//   const [difficulties, setDifficulties] = useState(mockDifficulties);

//   useEffect(() => {
//     const fetchDifficulties = async () => {
//       const difficulties = await handleGetDifficulties();
//       setDifficulties(difficulties);
//     };

//     const fetchCategories = async () => {
//       try {
//         const items = await handleGetCategories();
//         if (Array.isArray(items)) {
//           // Transform the data to match the MultiSelect Option type
//           const formattedCategories = items.map((item) => ({
//             label: item.label,
//             value: item.key,
//           }));
//           setCategories(formattedCategories);
//         } else {
//           console.error("Categories data is not an array:", items);
//           setCategories([]);
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         setCategories([]);
//       }
//     };
//     fetchCategories();
//     fetchDifficulties();
//   }, []);

//   const hasActiveFilters =
//     filters.status !== "" ||
//     filters.category !== "" ||
//     filters.difficulty !== "";

//   return (
//     <div className="flex flex-wrap gap-2">
//       {/* Status Filter */}
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button
//             variant={filters.status ? "secondary" : "outline"}
//             className="flex items-center gap-2"
//           >
//             <Filter size={16} />
//             Status
//             {filters.status && (
//               <span className="ml-1 rounded-full bg-primary w-2 h-2" />
//             )}
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="start" className="w-48">
//           <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           <DropdownMenuRadioGroup
//             value={filters.status}
//             onValueChange={(value) => setFilters({ ...filters, status: value })}
//           >
//             <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
//             <DropdownMenuRadioItem value="published">
//               Published
//             </DropdownMenuRadioItem>
//             <DropdownMenuRadioItem value="draft">Draft</DropdownMenuRadioItem>
//           </DropdownMenuRadioGroup>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {/* Category Filter */}
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button
//             variant={filters.category ? "secondary" : "outline"}
//             className="flex items-center gap-2"
//           >
//             <Filter size={16} />
//             Category
//             {filters.category && (
//               <span className="ml-1 rounded-full bg-primary w-2 h-2" />
//             )}
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="start" className="w-48">
//           <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           <DropdownMenuRadioGroup
//             value={filters.category}
//             onValueChange={(value) =>
//               setFilters({ ...filters, category: value })
//             }
//           >
//             <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
//             {categories.map((category) => (
//               <DropdownMenuRadioItem
//                 key={category.label}
//                 value={category.value}
//               >
//                 {category.label}
//               </DropdownMenuRadioItem>
//             ))}
//           </DropdownMenuRadioGroup>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {/* Difficulty Filter */}
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button
//             variant={filters.difficulty ? "secondary" : "outline"}
//             className="flex items-center gap-2"
//           >
//             <Filter size={16} />
//             Difficulty
//             {filters.difficulty && (
//               <span className="ml-1 rounded-full bg-primary w-2 h-2" />
//             )}
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="start" className="w-48">
//           <DropdownMenuLabel>Filter by Difficulty</DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           <DropdownMenuRadioGroup
//             value={filters.difficulty}
//             onValueChange={(value) =>
//               setFilters({ ...filters, difficulty: value })
//             }
//           >
//             <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
//             {difficulties.map((difficulty) => (
//               <DropdownMenuRadioItem
//                 key={difficulty.id}
//                 value={difficulty.name}
//               >
//                 {difficulty.name}
//               </DropdownMenuRadioItem>
//             ))}
//           </DropdownMenuRadioGroup>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {/* Reset Filters */}
//       {hasActiveFilters && (
//         <Button
//           variant="ghost"
//           className="text-muted-foreground"
//           onClick={resetFilters}
//         >
//           Reset filters
//         </Button>
//       )}
//     </div>
//   );
// }

"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { handleGetCategories, handleGetQuizLevels } from "@/utils/action";

interface QuizFiltersProps {
  filters: {
    status: string;
    category: string;
    difficulty: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      status: string;
      category: string;
      difficulty: string;
    }>
  >;
}

const mockCategories = [
  { label: "Programming", value: "1" },
  { label: "Mathematics", value: "2" },
  { label: "Science", value: "3" },
  { label: "Language", value: "4" },
];

const mockDifficulties = [
  { id: "1", name: "Beginner" },
  { id: "2", name: "Intermediate" },
  { id: "3", name: "Advanced" },
];

export default function QuizFilters({ filters, setFilters }: QuizFiltersProps) {
  const resetFilters = () => {
    setFilters({
      status: "",
      category: "",
      difficulty: "",
    });
  };

  const [categories, setCategories] = useState(mockCategories);
  const [difficulties, setDifficulties] = useState(mockDifficulties);

  useEffect(() => {
    const fetchDifficulties = async () => {
      const difficulties = await handleGetQuizLevels();
      setDifficulties(difficulties);
    };

    const fetchCategories = async () => {
      try {
        const items = await handleGetCategories();
        if (Array.isArray(items)) {
          const formattedCategories = items.map((item) => ({
            label: item.label,
            value: item.key,
          }));
          setCategories(formattedCategories);
        } else {
          console.error("Categories data is not an array:", items);
          setCategories(mockCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories(mockCategories);
      }
    };
    fetchCategories();
    fetchDifficulties();
  }, []);

  const hasActiveFilters =
    filters.status !== "" ||
    filters.category !== "" ||
    filters.difficulty !== "";

  return (
    <div className="flex flex-wrap gap-2">
      {/* Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={filters.status ? "secondary" : "outline"}
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            Status
            {filters.status && (
              <span className="ml-1 rounded-full bg-primary w-2 h-2" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
          >
            <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="published">
              Published
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="draft">Draft</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Category Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={filters.category ? "secondary" : "outline"}
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            Category
            {filters.category && (
              <span className="ml-1 rounded-full bg-primary w-2 h-2" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={filters.category}
            onValueChange={(value) =>
              setFilters({ ...filters, category: value })
            }
          >
            <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
            {categories.map((category) => (
              <DropdownMenuRadioItem
                key={category.value}
                value={category.value}
              >
                {category.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Difficulty Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={filters.difficulty ? "secondary" : "outline"}
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            Difficulty
            {filters.difficulty && (
              <span className="ml-1 rounded-full bg-primary w-2 h-2" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by Difficulty</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={filters.difficulty}
            onValueChange={(value) =>
              setFilters({ ...filters, difficulty: value })
            }
          >
            <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
            {difficulties.map((difficulty) => (
              <DropdownMenuRadioItem key={difficulty.id} value={difficulty.id}>
                {difficulty.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          className="text-muted-foreground"
          onClick={resetFilters}
        >
          Reset filters
        </Button>
      )}
    </div>
  );
}
