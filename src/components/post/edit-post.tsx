"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostEditor } from "./post-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Globe, Lock, Users, Eye, ArrowLeft, Loader2 } from "lucide-react";
import { FileUploadArea } from "./file-upload-area";
import { PostPreview } from "./post-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateTimePicker } from "@/components/date-time-picker";
import { toast } from "sonner";
import { sendRequest } from "@/utils/api";
import { handleGetCategories, handleGetPostTags} from "@/utils/action";
import { MultiSelect } from "../ui/multi-select";
import ai from "../../../src/assets/images/ai.webp"

// Define the Post type
interface Post {
  id: string;
  title: string;
  author: string;
  create_at: Date;
  content: string;
  excerpt: string | null;
  description: string;
  post_status: string;
  visibility: string;
  comment_status: boolean;
  ping_status: boolean;
  slug: string;
  categories: string[];
  tags: string[];
  feature_image: string;
  scheduled_at: string;
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

// Mock categories and tags data
const categoriesData = [
  { id: "1", name: "Web Development" },
  { id: "2", name: "JavaScript" },
  { id: "3", name: "Tutorials" },
  { id: "4", name: "Design" },
  { id: "5", name: "Mobile" },
];

const tagsData = [
  { id: "1", name: "Next.js" },
  { id: "2", name: "React" },
  { id: "3", name: "Patterns" },
  { id: "4", name: "Blog" },
  { id: "5", name: "TypeScript" },
];

export default function EditPostPage(props: any) {
  const session = props;
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<Post | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [isPublished, setIsPublished] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<string | File>("");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<ITag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [allowComments, setAllowComments] = useState(true);
  const [receiveNotifications, setReceiveNotifications] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [blocks, setBlocks] = useState<any[]>([
    { id: `block-content-${Date.now()}`, type: "text", content: "" },
  ]);

  console.log(">>>id: ", postId);

  // Xử lý client-side rendering
  // useEffect(() => {
  //   fetchPosts();
  //   setMounted(true);
  // }, []);

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
        const tagItems = await handleGetPostTags();
        setTags(
          tagItems?.map((item) => ({ label: item.label, value: item.key })) ||
            []
        );

        // Lấy bài viết
        const res = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/custom/with/${postId}`,
          method: "GET",
        });

        if (res.statusCode === 200 && res.data) {
          const postData = res.data;
          setPost(postData);
          setTitle(postData.title);
          setDescription(postData.description);
          setExcerpt(postData.excerpt || postData.description || "");
          setVisibility(postData.visibility);
          setIsPublished(postData.post_status === "published");
          setFeaturedImage(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/${postData.feature_image}`
          );
          setAllowComments(postData.comment_status);
          setReceiveNotifications(postData.ping_status);
          setSelectedCategories(postData.categories_id || []);
          setSelectedTags(postData.tags_id || []);

          console.log(">>>postData content: ", postData.content);
          // Cập nhật blocks
          if (postData.content) {
            setBlocks([
              {
                id: `block-content-${Date.now()}`,
                type: "text",
                content: postData.content,
              },
            ]);
          }

          console.log(">>>blocks: ", blocks);

          const scheduledDate = postData.scheduled_at
            ? new Date(postData.scheduled_at)
            : undefined;
          if (scheduledDate && !isNaN(scheduledDate.getTime())) {
            setDate(scheduledDate);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu ban đầu:", error);
      } finally {
        setMounted(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  // Hàm để lấy URL hiển thị cho PostPreview
  const getFeaturedImagePreviewUrl = () => {
    if (featuredImage instanceof File) {
      return URL.createObjectURL(featuredImage); // Tạo blob: URL cho preview
    }
    return featuredImage || ""; // Trả về string nếu đã là URL
  };

  const handleFeaturedImageSelect = (file: File) => {
    console.log("Selected featured image:", file);
    setFeaturedImage(file);
  };

  const handleFeaturedImageUpload = (url: string) => {
    setFeaturedImage(url);
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
          featuredImageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${result.data.url}`;
        } catch (error) {
          console.error("Error uploading featured image:", error);
        }
      }

      // Prepare the updated post data
      const updatedPost = {
        id: postId,
        title,
        description,
        excerpt: excerpt || description,
        categories_id: selectedCategories,
        visibility,
        post_status: isPublished ? "published" : "draft",
        feature_image:
          typeof featuredImageUrl === "string" ? featuredImageUrl : "",
        tags_id: selectedTags,
        comment_status: allowComments,
        ping_status: receiveNotifications,
        scheduled_at: date ? date.toISOString() : null,
        // Store both HTML content and structured blocks
        content: htmlContent,
        blocks_data: JSON.stringify(processedBlocks), // Store blocks as JSON for future editing
      };

      // Gửi dữ liệu lên server
      const response = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/${postId}`,
        method: "PUT",
        body: updatedPost,
      });

      if (response.statusCode === 200) {
        toast("Post updated successfully");
      } else {
        toast.error("Failed to update post");
      }

      setSaving(false);
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
      setSaving(false);
    } finally {
      setLoading(false);
      setMounted(true); // Đặt mounted sau khi tất cả state được cập nhật
    }
  };

  // console.log('>>>selectedCategories: ', selectedCategories)

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading post data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Edit Post</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/blog/${post?.slug}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
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
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter post description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Enter post excerpt (used for social media and listings)"
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    A short summary of your post. If left empty, the description will be used.
                  </p>
                </div> */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Content Blocks</CardTitle>
              <Tabs defaultValue="edit" className="w-[200px]"></Tabs>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="edit">
                <TabsContent value="edit">
                  <PostEditor blocks={blocks} setBlocks={setBlocks} />
                </TabsContent>
                <TabsContent value="preview">
                  {post && !loading && title && description ? (
                    <PostPreview
                      title={title}
                      description={description}
                      excerpt={excerpt}
                      blocks={blocks}
                      featuredImage={getFeaturedImagePreviewUrl()}
                      allowComments={allowComments}
                      receiveNotifications={receiveNotifications}
                    />
                  ) : (
                    <div>Đang tải bản xem trước...</div>
                  )}
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

              <div className="flex items-center justify-between">
                <Label htmlFor="comments">Allow Comments</Label>
                <Switch
                  id="comments"
                  checked={allowComments}
                  onCheckedChange={setAllowComments}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Receive Notifications</Label>
                <Switch
                  id="notifications"
                  checked={receiveNotifications}
                  onCheckedChange={setReceiveNotifications}
                />
              </div>

              <div className="space-y-2">
                <Label>Schedule</Label>
                <DateTimePicker
                  date={date}
                  setDate={(newDate) => {
                    // Chỉ cập nhật nếu giá trị thực sự thay đổi
                    if (newDate?.getTime() !== date?.getTime()) {
                      setDate(newDate);
                      if (newDate) {
                        setIsPublished(true);
                      }
                    }
                  }}
                />
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
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploadArea
                onFileSelect={handleFeaturedImageSelect}
                onFileUpload={handleFeaturedImageUpload}
                value={typeof featuredImage === "string" ? featuredImage : ""}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}