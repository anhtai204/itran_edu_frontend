"use client"

import { useContext } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserContext } from "@/library/user.context"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Star,
  FileCheck,
  ClipboardList,
  Users,
  PenTool,
  Trophy,
  Settings,
  User,
} from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const UserSideBar = () => {
  const { collapseMenu } = useContext(UserContext)!
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Bảng điều khiển",
      href: "/user",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Profiles",
      href: "/user/profiles",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Các khóa học đã đăng ký",
      href: "/user/enrolled_courses",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Tin nhắn",
      href: "/user/messages",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: "Danh sách mong muốn",
      href: "/user/wishlist",
      icon: <Star className="h-5 w-5" />,
    },
    {
      title: "Bài kiểm tra đã đăng ký",
      href: "/user/quizzes",
      icon: <FileCheck className="h-5 w-5" />,
    },
    {
      title: "Danh sách đăng ký khóa học",
      href: "/user/courses",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      title: "Nhóm",
      href: "/user/groups",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Bài tập",
      href: "/user/assignments",
      icon: <PenTool className="h-5 w-5" />,
    },
    {
      title: "Lịch sử điểm",
      href: "/user/points",
      icon: <Trophy className="h-5 w-5" />,
    },
  ]

  const settingsItems = [
    { title: "Writing", href: "/user/settings/writing" },
    { title: "Reading", href: "/user/settings/reading" },
    { title: "Comment", href: "/user/settings/comment" },
    { title: "Media", href: "/user/settings/media" },
    { title: "Permalink", href: "/user/settings/permalink" },
    { title: "Privacy", href: "/user/settings/privacy" },
    { title: "Favicon", href: "/user/settings/favicon" },
    { title: "Share", href: "/user/settings/share" },
  ]

  return (
    <aside
      className={cn(
        "bg-white dark:bg-gray-800 border-r h-screen transition-all duration-300 ease-in-out",
        collapseMenu ? "w-20" : "w-64",
      )}
    >
      <div className="py-4">
        <div className={cn("px-3 py-2 text-lg font-semibold", collapseMenu ? "text-center" : "px-6")}>
          {collapseMenu ? "IE" : "ItranEdu"}
        </div>

        <nav className="mt-5 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                    collapseMenu && "justify-center",
                  )}
                >
                  {item.icon}
                  {!collapseMenu && <span className="ml-3">{item.title}</span>}
                </Link>
              </li>
            ))}

            <li>
              {collapseMenu ? (
                <Link
                  href="/user/settings"
                  className="flex justify-center items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings className="h-5 w-5" />
                </Link>
              ) : (
                <Accordion type="single" collapsible className="border-none">
                  <AccordionItem value="settings" className="border-none">
                    <AccordionTrigger className="py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                      <div className="flex items-center">
                        <Settings className="h-5 w-5" />
                        <span className="ml-3">Cài đặt</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="pl-9 space-y-1 mt-1">
                        {settingsItems.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={cn(
                                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                pathname === item.href
                                  ? "bg-primary/10 text-primary"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                              )}
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default UserSideBar

