"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface IProps {
  isDetailModalOpen: boolean
  setIsDetailModalOpen: (v: boolean) => void
  dataDetail: any
  setDataDetail: any
}

const UserDetailModal = (props: IProps) => {
  const { isDetailModalOpen, setIsDetailModalOpen, dataDetail, setDataDetail } = props

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    if (dataDetail) {
      //code
      setFormData({
        name: dataDetail.username ?? "",
        email: dataDetail.email ?? "",
        phone: dataDetail.phone ?? "",
        address: dataDetail.address ?? "",
      })
    }
  }, [dataDetail])

  const handleCloseDetailModal = () => {
    setFormData({ name: "", email: "", phone: "", address: "" })
    setIsDetailModalOpen(false)
    setDataDetail(null)
  }

  return (
    <Dialog open={isDetailModalOpen} onOpenChange={(isOpen) => isOpen || handleCloseDetailModal()}>
      <DialogContent
        className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">User Details</DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            View user information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData?.email || ""}
                disabled
                className="bg-gray-100 dark:bg-gray-700"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                Name
              </Label>
              <Input id="name" value={formData.name} disabled className="bg-gray-100 dark:bg-gray-700" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                Phone
              </Label>
              <Input id="phone" value={formData.phone} disabled className="bg-gray-100 dark:bg-gray-700" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">
                Address
              </Label>
              <Input id="address" value={formData.address} disabled className="bg-gray-100 dark:bg-gray-700" />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseDetailModal}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Close
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UserDetailModal

