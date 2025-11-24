"use client";

const UserContent = ({
    children,
  }: Readonly<{
    children: React.ReactNode
  }>) => {
    return <main className="p-6 min-h-[calc(100vh-180px)]">{children}</main>
  }

export default UserContent;
