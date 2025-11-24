"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { NewsEditor } from "./news-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Globe,
  Lock,
  Users,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { FileUploadArea } from "./file-upload-area";
import { NewsPreview } from "./news-preview";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DateTimePicker } from "@/components/date-time-picker";
import { toast } from "sonner";
import { MultiSelect } from "@/components/ui/multi-select";
import { sendRequest } from "@/utils/api";
import {
  handleGetCategories,
  handleGetNewsTags,
  handleUpdateNews,
} from "@/utils/action";
import { generateId } from "@/utils/generatedId";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

// Define the Post type
interface News {
  id: string;
  title: string;
  content: string;
  description: string;
  excerpt: string;
  news_status: string;
  slug: string;
  categories_id: string[];
  tags_id: string[];
  visibility: string;
  author_id: string;
  feature_image: string | null;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
  blocks_data?: any; // Thay đổi kiểu dữ liệu để phù hợp với cả string và object
  author?: {
    name: string;
  };
  categories?: {
    name: string;
    id: string;
  }[];
  tags?: {
    name: string;
    id: string;
  }[];
}

interface ICategory {
  label: string;
  value: string;
  key?: string;
}

interface ITag {
  label: string;
  value: string;
  key?: string;
}

interface IBackendRes<T> {
  statusCode: number;
  message: string;
  data: T;
}

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();
  const newsId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [news, setNews] = useState<News | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [slug, setSlug] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [isPublished, setIsPublished] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<string | File>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [blocks, setBlocks] = useState<any[]>([
    { id: `block-text-${generateId()}`, type: "text", content: "" },
  ]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<ITag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [backDialogOpen, setBackDialogOpen] = useState(false)

  // generate slug
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generatedSlug);
    }
  }, [title]);

  const handleDateChange = React.useCallback(
    (newDate: Date | undefined) => {
      if (newDate?.getTime() !== date?.getTime()) {
        setDate(newDate);
        if (newDate) {
          setIsPublished(true);
        }
      }
    },
    [date, setDate, setIsPublished]
  );

  // Fetch news data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy danh mục
        const categoryItems = await handleGetCategories();
        setCategories(
          categoryItems?.map((item) => ({
            label: item.label,
            value: item.key,
          })) || []
        );

        // Lấy tags
        const tagItems = await handleGetNewsTags();
        setTags(
          tagItems?.map((item) => ({ label: item.label, value: item.key })) ||
            []
        );

        // Lấy bài viết
        const res = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/news/custom/with/${newsId}`,
          method: "GET",
        });

        if (res.statusCode === 200 && res.data) {
          const newsData = res.data;
          setNews(newsData);
          setTitle(newsData.title.trim());
          setDescription(newsData.description.trim());
          setExcerpt(
            newsData.excerpt.trim() || newsData.description.trim() || ""
          );
          setSlug(newsData.slug.trim());
          setVisibility(newsData.visibility);
          setIsPublished(newsData.news_status === "published");
          setFeaturedImage(newsData.feature_image);
          setSelectedCategories(newsData.categories_id || []);
          setSelectedTags(newsData.tags_id || []);

          // Parse blocks_data
          if (newsData.blocks_data) {
            let parsedBlocks;
            if (typeof newsData.blocks_data === "string") {
              try {
                parsedBlocks = JSON.parse(newsData.blocks_data);
              } catch (error) {
                console.error("Error parsing blocks_data:", error);
                parsedBlocks = parseContentToBlocks(newsData.content);
              }
            } else {
              // Nếu blocks_data đã là object
              parsedBlocks = newsData.blocks_data;
            }

            if (Array.isArray(parsedBlocks) && parsedBlocks.length > 0) {
              setBlocks(parsedBlocks);
            } else {
              // Fallback to parsing content
              setBlocks(parseContentToBlocks(newsData.content));
            }
          } else if (newsData.content) {
            // Nếu không có blocks_data, parse từ content
            setBlocks(parseContentToBlocks(newsData.content));
          }

          // Xử lý scheduled_at
          const scheduledDate = newsData.scheduled_at
            ? new Date(newsData.scheduled_at)
            : undefined;
          if (scheduledDate && !isNaN(scheduledDate.getTime())) {
            if (scheduledDate.getTime() !== date?.getTime()) {
              setDate(scheduledDate);
            }
          }

          console.log(">>>scheduledDate: ", scheduledDate);
          console.log(">>>typeof scheduledDate: ", typeof scheduledDate);
          console.log(
            ">>>typeof date obj: ",
            typeof new Date(newsData.scheduled_at)
          );
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu ban đầu:", error);
      } finally {
        setMounted(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [newsId]);

  const handleFeaturedImageSelect = (file: File) => {
    setFeaturedImage(file);
  };

  const handleFeaturedImageUpload = (url: string) => {
    setFeaturedImage(url);
  };

  // Hàm để lấy URL hiển thị cho NewsPreview
  const getFeaturedImagePreviewUrl = () => {
    if (featuredImage instanceof File) {
      return URL.createObjectURL(featuredImage); // Tạo blob: URL cho preview
    }
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/${featuredImage}` || ""; // Trả về string nếu đã là URL
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Process blocks for saving
      const processedBlocks = await Promise.all(
        blocks.map(async (block) => {
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
                content: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${result.data.url}`,
              };
            } catch (error) {
              console.error("Error uploading file:", error);
              return block;
            }
          }
          return block;
        })
      );

      // Generate HTML content for backward compatibility
      const htmlContent = processedBlocks
        .map((block) => {
          switch (block.type) {
            case "text":
              return block.content || "";
            case "image":
              return `<figure><img src="${block.content}" alt="Image" /></figure>`;
            case "video":
              return `<video controls src="${block.content}"></video>`;
            case "code":
              return `<pre><code>${block.content || ""}</code></pre>`;
            case "list":
              if (block.listType === "ordered") {
                return `<ol>${(block.content || "")
                  .split("\n")
                  .map((item: any) => `<li>${item}</li>`)
                  .join("")}</ol>`;
              } else {
                return `<ul>${(block.content || "")
                  .split("\n")
                  .map((item: any) => `<li>${item}</li>`)
                  .join("")}</ul>`;
              }
            default:
              return block.content || "";
          }
        })
        .join("\n");

      // Handle featured image upload if it's a File
      let featuredImageUrl = featuredImage;
      if (featuredImage instanceof File) {
        const formData = new FormData();
        formData.append("file", featuredImage);

        try {
          const uploadResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/single`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!uploadResponse.ok) {
            throw new Error("Failed to upload featured image");
          }

          const result = await uploadResponse.json();
          featuredImageUrl = result.data.url;
        } catch (error) {
          console.error("Error uploading featured image:", error);
        }
      }

      console.log(">>>featuredImageUrl: ", featuredImageUrl);

      // Prepare the updated news data
      const updatedNews = {
        id: newsId,
        content: htmlContent,
        title,
        description,
        excerpt: excerpt || description,
        news_status: isPublished ? "published" : "draft",
        visibility,
        slug,
        categories_id: selectedCategories,
        tags_id: selectedTags,
        update_at: new Date().toISOString(),
        feature_image:
          typeof featuredImageUrl === "string" ? featuredImageUrl : "",
        scheduled_at: date ? date.toISOString() : null,
        blocks_data: processedBlocks, // Gửi trực tiếp dưới dạng object
      };

      try {
        const response = await handleUpdateNews(updatedNews);
        console.log(">>>response: ", response);
        if (response.statusCode === 200) {
          toast("News updated successfully");
          router.push("/dashboard/news/all-news");
        } else {
          toast.error("Failed to update news");
        }
      } catch (error) {
        console.error("Error updating news:", error);
      }

      console.log(">>>updatedNews: ", updatedNews);

      setSaving(false);
    } catch (error) {
      console.error("Error updating news:", error);
      toast.error("Failed to update news");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading news data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={()=>setBackDialogOpen(true)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Dialog open={backDialogOpen} onOpenChange={setBackDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Are you sure you want to back ?
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. The data has not been saved, if you navigate the data will not be recoverable.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setBackDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="default" onClick={() => router.back()}>
                  Back
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <h1 className="text-3xl font-bold">Edit News</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>News Content</CardTitle>
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
                    A short summary of your article. If left empty, the description
                    will be used.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Content Blocks</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="edit"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsContent value="edit">
                  <NewsEditor
                    title={title}
                    description={description}
                    excerpt={excerpt}
                    featuredImage={getFeaturedImagePreviewUrl()}
                    blocks={blocks}
                    setBlocks={setBlocks}
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <NewsPreview
                    title={title}
                    description={description}
                    excerpt={excerpt}
                    blocks={blocks}
                    featuredImage={getFeaturedImagePreviewUrl()}
                  />
                </TabsContent>
              </Tabs>
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
              </div>

              <div className="space-y-2">
                <Label>Visibility</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={visibility === "public" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setVisibility("public")}
                    className="flex items-center gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    Public
                  </Button>
                  <Button
                    variant={visibility === "private" ? "default" : "outline"}
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
                <DateTimePicker date={date} setDate={handleDateChange} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <MultiSelect
                options={tags}
                selected={selectedTags}
                onChange={setSelectedTags}
                placeholder="Select tags"
              />
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
                The slug is the URL-friendly version of the title. It is usually
                all lowercase and contains only letters, numbers, and hyphens.
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
                  typeof featuredImage === "string"
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${featuredImage}`
                    : ""
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Hàm phân tích nội dung HTML thành các blocks
function parseContentToBlocks(content: string) {
  // Tạo một mảng để lưu trữ các blocks
  const blocks: any[] = [];

  // Nếu content là chuỗi rỗng, trả về một block text mặc định
  if (!content || content.trim() === "") {
    return [{ id: `block-text-${generateId()}`, type: "text", content: "" }];
  }

  try {
    // Phân tích HTML thành các block
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    // Xử lý từng phần tử con của body
    Array.from(doc.body.children).forEach((element) => {
      if (element.tagName === "FIGURE") {
        const img = element.querySelector("img");
        if (img && img.src) {
          blocks.push({
            id: `block-image-${generateId()}`,
            type: "image",
            content: img.src,
          });
        }
      } else if (element.tagName === "PRE") {
        const code = element.querySelector("code");
        if (code) {
          blocks.push({
            id: `block-code-${generateId()}`,
            type: "code",
            content: code.textContent || "",
          });
        }
      } else if (element.tagName === "VIDEO") {
        if (element.getAttribute("src")) {
          blocks.push({
            id: `block-video-${generateId()}`,
            type: "video",
            content: element.getAttribute("src") || "",
          });
        }
      } else if (element.tagName === "UL" || element.tagName === "OL") {
        blocks.push({
          id: `block-list-${generateId()}`,
          type: "list",
          content: Array.from(element.querySelectorAll("li"))
            .map((li) => li.textContent)
            .join("\n"),
          listType: element.tagName === "UL" ? "bullet" : "ordered",
        });
      } else {
        // Các thẻ văn bản khác
        blocks.push({
          id: `block-text-${generateId()}`,
          type: "text",
          content: element.outerHTML,
        });
      }
    });
  } catch (error) {
    console.error("Error parsing HTML:", error);
  }

  // Nếu không có blocks nào được tạo, tạo một block text mặc định
  if (blocks.length === 0) {
    blocks.push({
      id: `block-text-${generateId()}`,
      type: "text",
      content: content || "",
    });
  }

  return blocks;
}
