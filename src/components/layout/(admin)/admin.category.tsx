"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  handleGetCategories,
  handleCreateCategory,
  handleDeleteCategory,
  handleUpdateCategory,
} from "@/utils/action";

// Data structure
interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  parent_id: string; // Single parent ID
  level?: number; // For display purposes
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    parent_id: "", // Single parent ID
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const items = await handleGetCategories();

        console.log(">>>categories: ", items);

        if (Array.isArray(items)) {
          // Transform the data to match our Category type
          const formattedCategories = items.map((item) => ({
            id: item.key,
            name: item.label,
            description: item.description || "", // The API might not return this
            slug: item.slug || "", // The API might not return this
            parent_id: item.parent_id || "", // Single parent ID
          }));
          setCategories(formattedCategories);
        } else {
          console.error("Categories data is not an array:", items);
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast("Lỗi khi tải danh mục");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Tạo slug từ tên
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingCategory) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const handleCreate = async () => {
    // Check if category with same name already exists
    const nameExists = categories.some(
      (cat) => cat.name.toLowerCase() === formData.name.toLowerCase()
    );

    // Check if category with same slug already exists
    const slugExists = categories.some((cat) => cat.slug === formData.slug);

    if (nameExists) {
      toast("Danh mục với tên này đã tồn tại");
      return;
    }

    if (slugExists) {
      toast("Danh mục với đường dẫn này đã tồn tại");
      return;
    }

    try {
      console.log(">>>formData: ", formData);
      const { name, description, slug, parent_id } = formData;
      console.log(">>>parent_id: ", parent_id);
      const response = await handleCreateCategory({
        name: name,
        description: description,
        slug: slug,
        parent_id: parent_id === "none" ? null : parent_id, // Set parent_id to null if "none" is selected
      });
      // const response = await handleCreateCategory(formData);
      console.log(">>>response: ", response);

      if (response.statusCode === 201) {
        // Add the new category to the local state
        const newCategory: Category = {
          id: response.data.id,
          name: formData.name,
          description: formData.description,
          slug: formData.slug,
          parent_id: formData.parent_id === "none" ? "" : formData.parent_id, // Set parent_id to empty string if "none" is selected
        };

        setCategories([...categories, newCategory]);

        console.log(">>>categories: ", categories);
        setFormData({
          name: "",
          description: "",
          slug: "",
          parent_id: "",
        });

        toast("Đã thêm danh mục mới");
      } else {
        toast("Lỗi khi thêm danh mục: " + response.message);
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast("Lỗi khi thêm danh mục");
    }
  };

  // edit
  const handleUpdate = async () => {
    if (!editingCategory) return;

    // Check if any other category has the same name
    const nameExists = categories.some(
      (cat) =>
        cat.id !== editingCategory &&
        cat.name.toLowerCase() === formData.name.toLowerCase()
    );

    // Check if any other category has the same slug
    const slugExists = categories.some(
      (cat) => cat.id !== editingCategory && cat.slug === formData.slug
    );

    if (nameExists) {
      toast("Danh mục với tên này đã tồn tại");
      return;
    }

    if (slugExists) {
      toast("Danh mục với đường dẫn này đã tồn tại");
      return;
    }

    // Prevent setting a category as its own parent
    if (formData.parent_id === editingCategory) {
      toast("Danh mục không thể là danh mục cha của chính nó");
      return;
    }

    // Check if the new parent is a descendant of this category (to prevent circular references)
    if (formData.parent_id && formData.parent_id !== "none") {
      let currentParentId = formData.parent_id;
      let isCircular = false;

      // Check up the hierarchy to see if we encounter the category being edited
      while (currentParentId) {
        const parent = categories.find((cat) => cat.id === currentParentId);
        if (!parent || !parent.parent_id) break;

        if (parent.parent_id === editingCategory) {
          isCircular = true;
          break;
        }

        currentParentId = parent.parent_id;
      }

      if (isCircular) {
        toast("Không thể chọn danh mục con làm danh mục cha (tạo vòng lặp)");
        return;
      }
    }

    try {
      const { name, description, slug, parent_id } = formData;
      const response = await handleUpdateCategory(editingCategory, {
        name: name,
        description: description,
        slug: slug,
        parent_id: parent_id === "none" ? "" : parent_id,
      });

      console.log('>>>formData: ', formData);
      console.log('>>>response: ', response);

      if (response.statusCode === 200) {
        try {
          setIsLoading(true);
          const items = await handleGetCategories();

          console.log(">>>categories: ", items);

          if (Array.isArray(items)) {
            // Transform the data to match our Category type
            const formattedCategories = items.map((item) => ({
              id: item.key,
              name: item.label,
              description: item.description || "", // The API might not return this
              slug: item.slug || "", // The API might not return this
              parent_id: item.parent_id || "", // Single parent ID
            }));
            setCategories(formattedCategories);
          } else {
            console.error("Categories data is not an array:", items);
            setCategories([]);
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
          toast("Lỗi khi tải danh mục");
        } finally {
          setIsLoading(false);
        }

        resetForm();
        toast("Danh mục đã được cập nhật thành công");
      } else {
        toast("Lỗi khi cập nhật danh mục: " + response.message);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast("Lỗi khi cập nhật danh mục");
    }
  };

  // Handle delete category
  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      // Check if any categories have this as a parent
      const hasChildren = categories.some(
        (cat) => cat.parent_id === categoryToDelete
      );

      if (hasChildren) {
        toast(
          "Danh mục này đang được sử dụng làm danh mục cha. Vui lòng xóa các danh mục con trước."
        );
        setCategoryToDelete(null);
        setDeleteDialogOpen(false);
        return;
      }

      try {
        const response = await handleDeleteCategory(categoryToDelete);

        if (response.statusCode === 200) {
          // Remove the category from the local state
          setCategories(
            categories.filter((cat) => cat.id !== categoryToDelete)
          );
          toast("Danh mục đã được xóa thành công");
        } else {
          toast("Lỗi khi xóa danh mục: " + response.message);
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        toast("Lỗi khi xóa danh mục");
      }

      setCategoryToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  // Organize categories into a hierarchical structure
  const organizeCategories = (cats: Category[]) => {
    const result: Category[] = [];
    const visited = new Set<string>();

    const addCategoryWithLevel = (category: Category, level: number) => {
      if (!visited.has(category.id)) {
        visited.add(category.id);
        result.push({ ...category, level });

        // Find and add children
        cats
          .filter((cat) => cat.parent_id === category.id)
          .forEach((child) => addCategoryWithLevel(child, level + 1));
      }
    };

    // Start with root categories (those without parents)
    cats
      .filter((cat) => !cat.parent_id)
      .forEach((rootCat) => addCategoryWithLevel(rootCat, 0));

    return result;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      slug: "",
      parent_id: "",
    });
    setEditingCategory(null);
    setIsEditing(false);
  };

  // Handle edit category
  const handleEditClick = (category: Category) => {
    setEditingCategory(category.id);
    setIsEditing(true);
    setFormData({
      name: category.name.trim(),
      description: category.description.trim(),
      slug: category.slug.trim(),
      parent_id: category.parent_id || "none",
    });
  };

  const organizedCategories = organizeCategories(categories);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Add Category Form */}
      <Card>
        <CardHeader>
          <CardTitle>Thêm danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleNameChange}
                required
              />
              <p className="text-sm text-muted-foreground">
                Tên là cách nó xuất hiện trên trang web của bạn.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Đường dẫn</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
              />
              <p className="text-sm text-muted-foreground">
                "slug" là đường dẫn thân thiện của tên. Nó thường chỉ bao gồm kí
                tự viết thường, số và dấu gạch ngang.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Danh mục cha</Label>
              <Select
                value={formData.parent_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, parent_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục cha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không có danh mục cha</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Chọn danh mục cha nếu đây là danh mục con.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                Thông thường mô tả này không được sử dụng trong các giao diện,
                tuy nhiên có vài giao diện có thể hiển thị mô tả này.
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {isEditing ? "Cập nhật danh mục" : "Thêm danh mục"}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Hủy
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Categories Tree View */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {organizedCategories.length > 0 ? (
                organizedCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800"
                  >
                    <div
                      className="flex items-center gap-2"
                      style={{ marginLeft: `${category.level! * 20}px` }}
                    >
                      <span className="text-muted-foreground">
                        {"-".repeat(category.level! + 1)}
                      </span>
                      <span>{category.name}</span>
                    </div>
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(category.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button> */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(category)}
                        className="h-8 w-8"
                      >
                        <Edit2 className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(category.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Chưa có danh mục nào.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
