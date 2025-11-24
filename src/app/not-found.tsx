import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import HeaderCheckLogin from "@/components/layout/header"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white dark:from-purple-900 dark:to-gray-800">
      {/* <Header /> */}
      <HeaderCheckLogin />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Bài viết không tồn tại</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button asChild>
            <Link href="/blog">Quay lại trang Blog</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

