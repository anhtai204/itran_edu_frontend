// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import {
//   LayoutDashboard,
//   BarChart2,
//   ShoppingCart,
//   Layout,
//   AppWindowIcon as Apps,
//   CreditCard,
//   Box,
//   Component,
//   FileIcon,
//   Table,
//   Lock,
//   UserCircle,
//   Clock,
//   File,
//   HelpCircle,
//   DollarSign,
//   PieChart,
// } from "lucide-react"

// const menuItems = [
//   {
//     title: "MAIN MENU",
//     items: [
//       {
//         title: "Dashboard",
//         icon: LayoutDashboard,
//         href: "/dashboard",
//       },
//       {
//         title: "Analysis",
//         icon: BarChart2,
//         href: "/analysis",
//       },
//       {
//         title: "eCommerce",
//         icon: ShoppingCart,
//         href: "/ecommerce",
//       },
//       {
//         title: "Manage User",
//         icon: UserCircle,
//         href: "/dashboard/user",
//       },
//     ],
//   },
//   {
//     title: "UI ELEMENTS",
//     items: [
//       {
//         title: "Widgets",
//         icon: Layout,
//         href: "/widgets",
//       },
//       {
//         title: "Apps",
//         icon: Apps,
//         href: "/apps",
//       },
//       {
//         title: "Cards",
//         icon: CreditCard,
//         href: "/cards",
//       },
//       {
//         title: "eCommerce",
//         icon: Box,
//         href: "/ecommerce-ui",
//       },
//       {
//         title: "Components",
//         icon: Component,
//         href: "/components",
//       },
//       {
//         title: "Icons",
//         icon: FileIcon,
//         href: "/",
//       },
//     ],
//   },
//   {
//     title: "FORMS & TABLES",
//     items: [
//       {
//         title: "Forms",
//         icon: File,
//         href: "/",
//       },
//       {
//         title: "Tables",
//         icon: Table,
//         href: "/dashboard/eroom",
//       },
//     ],
//   },
//   {
//     title: "PAGES",
//     items: [
//       {
//         title: "Authentication",
//         icon: Lock,
//         href: "/",
//       },
//       {
//         title: "User Profile",
//         icon: UserCircle,
//         href: "/",
//       },
//       {
//         title: "Timeline",
//         icon: Clock,
//         href: "/",
//       },
//       {
//         title: "Post",
//         icon: File,
//         href: "/dashboard/post/all-posts",
//         children: [
//           {
//             title: "Create post",
//             href: "/dashboard/post",
//           },
//           {
//             title: "Category",
//             href: "/dashboard/category",
//           },
//           {
//             title: "Tag",
//             href: "/dashboard/post_tags",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     title: "OTHER",
//     items: [
//       {
//         title: "FAQ",
//         icon: HelpCircle,
//         href: "/faq",
//       },
//       {
//         title: "Pricing",
//         icon: DollarSign,
//         href: "/pricing",
//       },
//       {
//         title: "Charts",
//         icon: PieChart,
//         href: "/charts",
//       },
//     ],
//   },
// ]

// export function Sidebar() {
//   const pathname = usePathname()

//   console.log('>>>pathname: ', pathname);

//   return (
//     <div className="hidden lg:flex h-screen w-64 flex-col fixed left-0 top-0 bottom-0 border-r bg-background">
//       <div className="p-6">
//         <Link href="/" className="flex items-center gap-2">
//           <div className="h-7 w-7 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-lg" />
//           <span className="text-xl font-bold">ITRAN EDU</span>
//         </Link>
//       </div>

//       <div className="flex-1 overflow-auto py-2">
//         {menuItems.map((section, i) => (
//           <div key={i} className="px-4 py-2">
//             <h4 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">{section.title}</h4>
//             <div className="space-y-1">
//               {section.items.map((item, j) => (
//                 <div key={j}>
//                   <Link
//                     href={item.href}
//                     className={cn(
//                       "flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium hover:bg-accent",
//                       pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
//                     )}
//                   >
//                     <item.icon className="h-4 w-4" />
//                     {item.title}
//                   </Link>
//                   {item.children && (
//                     <div className="ml-6 mt-1 space-y-1">
//                       {item.children.map((child, k) => (
//                         <Link
//                           key={k}
//                           href={child.href}
//                           className={cn(
//                             "block text-sm text-muted-foreground hover:text-accent-foreground",
//                             pathname === child.href ? "text-accent-foreground" : ""
//                           )}
//                         >
//                           {child.title}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BarChart2,
  ShoppingCart,
  Layout,
  AppWindowIcon as Apps,
  CreditCard,
  Box,
  Component,
  FileIcon,
  Table,
  Lock,
  UserCircle,
  Clock,
  File,
  HelpCircle,
  DollarSign,
  PieChart,
  ChevronRight,
  Menu,
  ChevronLeft,
  PanelLeftClose,
  PanelLeft,
  Newspaper,
  Grid2x2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const menuItems = [
  {
    title: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
      {
        title: "Analysis",
        icon: BarChart2,
        href: "/dashboard/analysis",
      },
      // {
      //   title: "eCommerce",
      //   icon: ShoppingCart,
      //   href: "/ecommerce",
      // },
      {
        title: "Manage User",
        icon: UserCircle,
        href: "/dashboard/user",
      },
    ],
  },
  {
    title: "UI ELEMENTS",
    items: [
      {
        title: "Widgets",
        icon: Layout,
        href: "/dashboard/widgets",
      },
      // {
      //   title: "Apps",
      //   icon: Apps,
      //   href: "/apps",
      // },
      // {
      //   title: "Cards",
      //   icon: CreditCard,
      //   href: "/cards",
      // },
      // {
      //   title: "eCommerce",
      //   icon: Box,
      //   href: "/ecommerce-ui",
      // },
      // {
      //   title: "Components",
      //   icon: Component,
      //   href: "/components",
      // },
      {
        title: "Icons",
        icon: FileIcon,
        href: "/dashboard/icons",
      },
    ],
  },
  {
    title: "FORMS & TABLES",
    items: [
      {
        title: "Forms",
        icon: File,
        href: "/dashboard/forms",
      },
      {
        title: "Tables",
        icon: Table,
        href: "/dashboard/tables",
      },
    ],
  },
  {
    title: "PAGES",
    items: [
      // {
      //   title: "Authentication",
      //   icon: Lock,
      //   href: "/",
      // },
      {
        title: "User Profile",
        icon: UserCircle,
        href: "/dashboard/profile",
      },
      {
        title: "Time",
        icon: Clock,
        href: "/dashboard/time",
      },
      // {
      //   title: "Category",
      //   icon: Grid2x2,
      //   href: "/dashboard/category",
      // },
      {
        title: "Category",
        icon: Grid2x2,
        href: "",
        children: [
          {
            title: "Post/News",
            href: "/dashboard/category",
          },
          {
            title: "Quiz",
            href: "/dashboard/category_quiz",
          },
        ],
      },
      {
        title: "Quiz",
        icon: File,
        href: "",
        children: [
          {
            title: "All Quizzes",
            href: "/dashboard/quiz/all-quizzes",
          },
          {
            title: "Create Quiz",
            href: "/dashboard/quiz",
          },
          {
            title: "Levels",
            href: "/dashboard/quiz_levels",
          },
        ],
      },
      {
        title: "Post",
        icon: File,
        href: '',
        children: [
          {
            title: "All Posts",
            href: "/dashboard/post/all-posts",
          },
          {
            title: "Create Post",
            href: "/dashboard/post",
          },
          {
            title: "Post Tags",
            href: "/dashboard/post_tags",
          },
          {
            title: "Comments",
            href: "/dashboard/comment",
          }
        ],
      },
      {
        title: "News",
        icon: Newspaper,
        href: '',
        children: [
          {
            title: "All News",
            href: "/dashboard/news/all-news",
          },
          {
            title: "Create News",
            href: "/dashboard/news",
          },
          {
            title: "News Tags",
            href: "/dashboard/news_tags",
          },
        ],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        title: "FAQ",
        icon: HelpCircle,
        href: "/dashboard/faq",
      },
      {
        title: "Pricing",
        icon: DollarSign,
        href: "/dashboard/pricing",
      },
      {
        title: "Charts",
        icon: PieChart,
        href: "/dashboard/charts",
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({})

  // Load collapsed state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) {
      setIsCollapsed(savedState === "true")
    }
  }, [])

  // Auto-expand sections based on current path
  useEffect(() => {
    menuItems.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children) {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          if (isActive) {
            setOpenSections((prev) => ({ ...prev, [item.href]: true }))
          }
        }
      })
    })
  }, [pathname])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebarCollapsed", String(newState))
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const toggleSection = (href: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [href]: !prev[href],
    }))
  }

  const handleItemClick = (item: any, e: React.MouseEvent) => {
    // If item has children, toggle the section
    if (item.children) {
      e.preventDefault()
      toggleSection(item.href)

      // Also navigate to the parent page
      router.push(item.href)
    }
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      {/* Mobile menu button - visible on small screens */}
      <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 lg:hidden" onClick={toggleMobileSidebar}>
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar backdrop for mobile */}
      {isMobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleMobileSidebar} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-background border-r transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[70px]" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className={cn("p-6 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed ? (
            <Link href="/" className="flex items-center gap-2">
              <div className="h-7 w-7 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-lg" />
              <span className="text-xl font-bold">ITRAN EDU</span>
            </Link>
          ) : (
            <div className="h-7 w-7 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-lg" />
          )}

          <Button
            variant="ghost"
            size="icon"
            className={cn("lg:flex", isCollapsed ? "hidden" : "lg:hidden")}
            onClick={toggleMobileSidebar}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col h-[calc(100vh-80px)]">
          {/* Toggle sidebar button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-[-12px] top-12 hidden lg:flex h-6 w-6 rounded-full border bg-background shadow-sm"
            onClick={toggleSidebar}
          >
            {isCollapsed ? <PanelLeft className="h-3 w-3" /> : <PanelLeftClose className="h-3 w-3" />}
          </Button>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 py-2">
            <TooltipProvider>
              {menuItems.map((section, i) => (
                <div key={i} className={cn("py-2", isCollapsed ? "px-2" : "px-4")}>
                  {!isCollapsed && (
                    <h4 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">{section.title}</h4>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item, j) => (
                      <Tooltip key={j}>
                        <TooltipTrigger asChild>
                          <div>
                            <Link
                              href={item.href}
                              className={cn(
                                "flex items-center rounded-lg px-2 py-2 text-sm font-medium hover:bg-accent",
                                isActive(item.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                                isCollapsed && "justify-center",
                              )}
                              onClick={(e) => handleItemClick(item, e)}
                            >
                              <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                              {!isCollapsed && <span className="flex-1">{item.title}</span>}
                              {!isCollapsed && item.children && (
                                <ChevronRight
                                  className={cn("h-4 w-4 transition-transform", openSections[item.href] && "rotate-90")}
                                />
                              )}
                            </Link>
                            {!isCollapsed && item.children && openSections[item.href] && (
                              <div className="ml-6 mt-1 space-y-1 border-l-2 border-muted pl-2">
                                {item.children.map((child, k) => (
                                  <Link
                                    key={k}
                                    href={child.href}
                                    className={cn(
                                      "block rounded-md px-2 py-1.5 text-sm hover:bg-accent/50",
                                      pathname === child.href
                                        ? "bg-accent/50 text-accent-foreground font-medium"
                                        : "text-muted-foreground",
                                    )}
                                  >
                                    {child.title}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        {isCollapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
                      </Tooltip>
                    ))}
                  </div>
                </div>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </div>
    </>
  )
}

