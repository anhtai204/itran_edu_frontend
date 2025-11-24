"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Globe, Lock, Users, MessageSquare, Bell } from "lucide-react";

import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "sonner";
import { DateTimePicker } from "@/components/date-time-picker";
import { NewsEditor } from "./news-editor";
import { FileUploadArea } from "./file-upload-area";
import { generateId } from "@/utils/generatedId";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleCreateNews, handleGetCategories, handleGetNewsTags } from "@/utils/action";

export default function CreateNewsPage(props: any) {
  const { session } = props;
  const router = useRouter();

  // Đảm bảo tất cả các hooks được gọi ở cùng một thứ tự trong mỗi lần render
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<{ label: string; value: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState("public");
  const [isPublished, setIsPublished] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<File | string>("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [navigateDialog, setNavigateDialogOpen] = useState(false);
  const [blocks, setBlocks] = useState<any[]>([
    {
      id: `block-text-${generateId()}`,
      type: "text",
      content: "",
    },
  ]);

  const refreshData = () => {
    setTitle("");
    setDescription("");
    setExcerpt("");
    setSelectedCategories([]);
    setSelectedTags([]);
    setVisibility("public");
    setIsPublished(false);
    setFeaturedImage("");
    setSlug("");
    setDate(undefined);
    setBlocks([
      {
        id: `block-text-${generateId()}`,
        type: "text",
        content: "",
      },
    ]);
    // Force a re-render of the FileUploadArea by adding a key
    const fileUploadArea = document.querySelector('[data-testid="file-upload-area"]')
    if (fileUploadArea) {
      // Add a unique key to force re-render
      fileUploadArea.setAttribute("data-key", Date.now().toString())
    }
    setNavigateDialogOpen(false);
  };

  // Xử lý client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const items = await handleGetCategories();
        if (Array.isArray(items)) {
          // Transform the data to match the MultiSelect Option type
          const formattedCategories = items.map((item) => ({
            label: item.label,
            value: item.key,
          }));
          setCategories(formattedCategories);
        } else {
          console.error("Categories data is not an array:", items);
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const items = await handleGetNewsTags();
        if (Array.isArray(items)) {
          // Transform the data to match the MultiSelect Option type
          const formattedTags = items.map((item) => ({
            label: item.label,
            value: item.key,
          }));
          setTags(formattedTags);
        } else {
          console.error("Tags data is not an array:", items);
          setTags([]);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
        setTags([]);
      }
    };

    fetchTags();
  }, []);

  // Generate slug from title
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generatedSlug);
    }
  }, [title]);

  const handleFeaturedImageUpload = (url: string) => {
    setFeaturedImage(url);
  };

  const handleFeaturedImageSelect = async (file: File) => {
    setFeaturedImage(file);
  };

  // Hàm để lấy URL hiển thị cho NewsPreview
  const getFeaturedImagePreviewUrl = () => {
    if (featuredImage instanceof File) {
      return URL.createObjectURL(featuredImage); // Tạo blob: URL cho preview
    }
    return featuredImage || ""; // Trả về string nếu đã là URL
  };

  const uploadFileToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const uploadResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/single`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      console.error("Upload failed with status:", uploadResponse.status);
      console.error("Response text:", await uploadResponse.text());
      throw new Error("Failed to upload file");
    }

    const result = await uploadResponse.json();
    return await result.data.url;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!title) {
      toast("Title is required");
      return;
    }

    try {
      // Process blocks for saving
      const processedBlocks = await Promise.all(
        blocks.map(async (block) => {
          // Đảm bảo mỗi block có ID duy nhất
          const blockId = block.id || `block-${block.type}-${generateId()}`;

          // If block content is a File, upload it first
          if (block.content instanceof File) {
            const formData = new FormData();
            formData.append("file", block.content);

            try {
              const uploadResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/single`,
                {
                  method: "POST",
                  body: formData,
                }
              );

              if (!uploadResponse.ok) {
                throw new Error("Failed to upload file");
              }

              const result = await uploadResponse.json();
              return {
                ...block,
                id: blockId,
                content: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${result.data.url}`,
              };
            } catch (error) {
              console.error("Error uploading file:", error);
              return { ...block, id: blockId };
            }
          }
          return { ...block, id: blockId };
        })
      );

      console.log("Processed Blocks:", processedBlocks);

      // Generate HTML content for backward compatibility
      const htmlContent = processedBlocks
        .map((block) => {
          switch (block.type) {
            case "text":
              return `<div data-block-id="${block.id}">${block.content}</div>`;
            case "list":
              return `<div data-block-id="${block.id}">${block.content}</div>`;
            case "image":
              return `<figure data-block-id="${block.id}"><img src="${block.content}" alt="Image" /></figure>`;
            case "video":
              return `<video data-block-id="${block.id}" controls src="${block.content}"></video>`;
            case "code":
              return `<pre data-block-id="${block.id}"><code>${block.content}</code></pre>`;
            default:
              return `<div data-block-id="${block.id}">${block.content}</div>`;
          }
        })
        .join("\n");

      let uploadedFeaturedImageUrl =
        typeof featuredImage === "string" ? featuredImage : "";
      if (featuredImage instanceof File) {
        uploadedFeaturedImageUrl = await uploadFileToServer(featuredImage);
        setFeaturedImage(uploadedFeaturedImageUrl);
      }

      const newsData = {
        title,
        content: htmlContent,
        blocks_data: processedBlocks, // Store blocks as JSON for future editing
        description: description,
        excerpt: excerpt || description,
        news_status: isDraft ? "draft" : isPublished ? "published" : "draft",
        slug,
        categories_id: selectedCategories,
        author_id: session?.user?.id,
        feature_image: uploadedFeaturedImageUrl || null,
        visibility,
        create_at: new Date().toISOString(),
        tags_id: selectedTags,
        scheduled_at: date,
      };

      console.log("blocks_data value:", newsData.blocks_data);
      console.log("type of blocks_data: ", typeof newsData.blocks_data);
      console.log(">>>newsData: ", newsData);

      const response = await handleCreateNews(newsData);

      if (response.statusCode === 201) {
        toast("News created successfully!");
        setNavigateDialogOpen(true);
      } else if (response.statusCode === 409) {
        toast("A news with this slug already exists");
      } else {
        toast(`Failed to create news: ${response.message}`);
      }
    } catch (error) {
      console.error("Error creating news:", error);
      toast("Failed to create news");
    }
  };

  // Render loading state if not mounted
  if (!mounted) {
    return <div className="p-6">Loading news editor...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 lg:ml-20">
        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Create new article</h1>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="dark:text-white"
                onClick={() => handleSubmit(true)}
              >
                Save Draft
              </Button>
              <Button onClick={() => handleSubmit(false)}>Publish</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Article Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter article title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter article description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        placeholder="Enter article excerpt (used for social media and listings)"
                        rows={2}
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        A short summary of your article. If left empty, the
                        description will be used.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Blocks</CardTitle>
                </CardHeader>
                <CardContent>
                  <NewsEditor
                    title={title}
                    description={description}
                    excerpt={excerpt}
                    featuredImage={getFeaturedImagePreviewUrl()}
                    blocks={blocks}
                    setBlocks={setBlocks}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categories">Categories</Label>
                    <MultiSelect
                      options={categories}
                      selected={selectedCategories}
                      onChange={setSelectedCategories}
                      placeholder="Select categories"
                    />
                    <p className="text-xs text-muted-foreground">
                      Select one or more categories for your article.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Visibility</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={
                          visibility === "public" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setVisibility("public")}
                        className="flex items-center gap-2"
                      >
                        <Globe className="h-4 w-4" />
                        Public
                      </Button>
                      <Button
                        variant={
                          visibility === "private" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setVisibility("private")}
                        className="flex items-center gap-2"
                      >
                        <Lock className="h-4 w-4" />
                        Private
                      </Button>
                      <Button
                        variant={
                          visibility === "restricted" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setVisibility("restricted")}
                        className="flex items-center gap-2"
                      >
                        <Users className="h-4 w-4" />
                        Restricted
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="published">Published</Label>
                    <Switch
                      id="published"
                      checked={isPublished}
                      onCheckedChange={setIsPublished}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Schedule</Label>
                    <DateTimePicker date={date} setDate={setDate} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <MultiSelect
                      options={tags}
                      selected={selectedTags}
                      onChange={setSelectedTags}
                      placeholder="Select tags"
                    />
                    <p className="text-xs text-muted-foreground">
                      Select one or more tags for your article.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Slug</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Add slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    The slug is the URL-friendly version of the title. It is
                    usually all lowercase and contains only letters, numbers,
                    and hyphens.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUploadArea
                    onFileSelect={handleFeaturedImageSelect}
                    onFileUpload={handleFeaturedImageUpload}
                    value={
                      typeof featuredImage === "string" ? featuredImage : ""
                    }
                  />
                </CardContent>
              </Card>
            </div>

            {/* Navigation Confirmation Dialog */}
            <Dialog open={navigateDialog} onOpenChange={setNavigateDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Do you want to navigate to the page to view the entire
                    article?
                  </DialogTitle>
                  <DialogDescription>
                    This action will navigate to the all news page.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={refreshData}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      router.push("/dashboard/news/all-news");
                      setNavigateDialogOpen(false);
                    }}
                  >
                    Navigate
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}
