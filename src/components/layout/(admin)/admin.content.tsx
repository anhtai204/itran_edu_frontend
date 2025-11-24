
"use client"

import type React from "react"

const AdminContent = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <main className="p-6 min-h-[calc(100vh-180px)]">{children}</main>
}

export default AdminContent