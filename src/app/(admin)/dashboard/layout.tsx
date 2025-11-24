import { auth } from "@/auth";
import AdminContent from "@/components/layout/(admin)/admin.content";
import Header from "@/components/layout/(admin)/admin.header";
import { Sidebar } from "@/components/layout/(admin)/admin.sidebar";
const AdminLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();


  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <Header session={session} />

        <AdminContent>{children}</AdminContent>
      </div>
    </div>
  );
};

export default AdminLayout;
