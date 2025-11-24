"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { handleUpdateUserAction } from "@/utils/action";

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  dataUpdate: any;
  setDataUpdate: any;
}

const UserUpdateModal = (props: IProps) => {
  const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate } =
    props;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (dataUpdate) {
      //code
      setFormData({
        name: dataUpdate.username ?? "",
        email: dataUpdate.email ?? "",
        phone: dataUpdate.phone ?? "",
        address: dataUpdate.address ?? "",
      });
    }
  }, [dataUpdate]);

  const handleCloseUpdateModal = () => {
    setFormData({ name: "", email: "", phone: "", address: "" });
    setIsUpdateModalOpen(false);
    setDataUpdate(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, phone, address } = formData;
    try {
      const res = await handleUpdateUserAction({
        id: dataUpdate.id,
        username: name,
        phone,
        address,
      });
      if (res?.data) {
        toast("User has been updated successfully.");
        handleCloseUpdateModal();
      } else {
        toast(res?.message);
      }
    } catch (error) {
      toast("Could not update user. Please try again.");
    }
  };

  return (
    <Dialog
      open={isUpdateModalOpen}
      onOpenChange={(isOpen) => isOpen || handleCloseUpdateModal()}
    >
      <DialogContent
        className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Update User
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Update user information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label
                htmlFor="email"
                className="text-gray-700 dark:text-gray-300"
              >
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
              <Label
                htmlFor="name"
                className="text-gray-700 dark:text-gray-300"
              >
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="phone"
                className="text-gray-700 dark:text-gray-300"
              >
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="address"
                className="text-gray-700 dark:text-gray-300"
              >
                Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseUpdateModal}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 mr-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white dark:text-black"
            >
              Update User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserUpdateModal;
