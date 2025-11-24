"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { handleDeleteUserAction, handleGetRoles, handleUpdateUserAction } from "@/utils/action"
import UserCreateModal from "./user-create-modal"
import { Pagination } from "@/components/ui/pagination"
import { ChevronDown, Eye, Pencil, Trash } from "lucide-react"
import { toast } from "sonner"
import UserUpdateModal from "./user-update-modal"
import UserDetailModal from "./user-detail-modal"

interface IProps {
  users: any[]
  meta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
}

const UserTableModal = (props: IProps) => {
  const { users, meta } = props
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false)
  const [dataUpdate, setDataUpdate] = useState<any>(null)
  const [dataDetail, setDataDetail] = useState<any>(null)
  const [userRoles, setUserRoles] = useState<{ [key: string]: number }>({})
  const [rolesMap, setRolesMap] = useState<{ [key: number]: string }>({})
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoles = async () => {
      const items = await handleGetRoles()
      setMenuItems(items)
      const roleMap = items.reduce((acc: { [key: number]: string }, item: any) => {
        acc[Number(item.key)] = item.label
        return acc
      }, {})
      setRolesMap(roleMap)
    }
    fetchRoles()
  }, [])

  const handleMenuClick = async (userId: string, role_id: number) => {
    setUserRoles((prev) => ({ ...prev, [userId]: role_id }))
    const res = await handleUpdateUserAction({ id: userId, role_id: role_id })
    if (res?.data) {
      const currentRoleId = res?.data?.role_id
      const currentRole = rolesMap[currentRoleId] || ""
      toast.success(`Updated role ${currentRole} for ${res?.data?.email}`)
    } else {
      toast.error("Error while updating role")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    const res = await handleDeleteUserAction(userId)
    if (res?.data) {
      toast.success("User deleted successfully")
    } else {
      toast.error("Error while deleting user")
    }
    setDeleteConfirmOpen(false)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("current", page.toString())
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h2>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white dark:text-black">
          Create User
        </Button>
      </div>

      <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow className="border-b dark:border-gray-700">
              <TableHead className="text-gray-700 dark:text-gray-300">STT</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">Email</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">Role</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {index + 1 + (meta.current - 1) * meta.pageSize}
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">{user.email}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                      >
                        {rolesMap[userRoles[user.id] || user.role_id] || "Select Role"}
                        <ChevronDown className="ml-auto h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      {menuItems.map((item) => (
                        <DropdownMenuItem
                          key={item.key}
                          onClick={() => handleMenuClick(user.id, Number(item.key))}
                          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          {item.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setIsDetailModalOpen(true)
                        setDataDetail(user)
                      }}
                      className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setIsUpdateModalOpen(true)
                        setDataUpdate(user)
                      }}
                      className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setUserToDelete(user.id)
                        setDeleteConfirmOpen(true)
                      }}
                      className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {(meta.current - 1) * meta.pageSize + 1} to {Math.min(meta.current * meta.pageSize, meta.total)} of{" "}
          {meta.total} entries
        </p>
        <Pagination currentPage={meta.current} totalPages={meta.pages} onPageChange={handlePageChange} />
      </div>

      <UserCreateModal isCreateModalOpen={isCreateModalOpen} setIsCreateModalOpen={setIsCreateModalOpen} />

      <UserUpdateModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />

      <UserDetailModal
        isDetailModalOpen={isDetailModalOpen}
        setIsDetailModalOpen={setIsDetailModalOpen}
        dataDetail={dataDetail}
        setDataDetail={setDataDetail}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">
              Are you sure you want to delete this user?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
              This action cannot be undone. This will permanently delete the user account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && handleDeleteUser(userToDelete)}
              className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default UserTableModal;

