// "use client";

// import { useState, useEffect } from "react";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import {
//   Search,
//   Filter,
//   Plus,
//   Edit,
//   Trash2,
//   Eye,
//   MoreHorizontal,
//   Calendar,
//   CheckCircle2,
//   Clock,
//   AlertCircle,
// } from "lucide-react";
// import { format } from "date-fns";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { Pagination } from "@/components/ui/pagination";
// import { PostsFilter } from "./posts-filter";
// import Image from "next/image";
// import { handleDeletePost, RawPost } from "@/utils/action";
// import { sendRequest } from "@/utils/api";
// import { toast } from "sonner";

// interface IProps {
//   initialPosts: RawPost[];
//   initialMeta: {
//     current: number;
//     pageSize: number;
//     pages: number;
//     total: number;
//   };
// }

// const AllPostManage = (props: IProps) => {
//   const { initialPosts, initialMeta } = props;
//   const [meta, setMeta] = useState(initialMeta);

//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   const { replace } = useRouter();

//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [posts, setPosts] = useState(initialPosts);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [postToDelete, setPostToDelete] = useState<string | null>(null);

//   const current = Number(searchParams.get("current")) || 1;
//   const pageSize = Number(searchParams.get("pageSize")) || initialMeta.pageSize;

//   useEffect(() => {
//     const fetchPosts = async () => {
//       const res = await sendRequest<IBackendRes<any>>({
//         url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/custom`,
//         method: "GET",
//         queryParams: { current, pageSize },
//       });
//       if (res.statusCode === 200) {
//         setPosts(res.data.results || []);
//         setMeta(res.data.meta);
//       }
//     };
//     if (current !== meta.current) {
//       fetchPosts();
//     }
//   }, [current, pageSize]);

//   const handlePageChange = (page: number) => {
//     const params = new URLSearchParams(searchParams);
//     params.set("current", page.toString());
//     replace(`${pathname}?${params.toString()}`);
//   };

//   // Pagination settings
//   const postsPerPage = 10;

//   // Fetch posts on component mount and when filters change
//   useEffect(() => {
//     fetchPosts();
//   }, [currentPage, statusFilter]);

//   const fetchPosts = async () => {
//     setLoading(true);
//     try {
//       // Fake data instead of API call
//       const res = await sendRequest<IBackendRes<any>>({
//         url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/custom`,
//         method: "GET",
//         queryParams: { current, pageSize },
//       });
//       if (res.statusCode === 200) {
//         setPosts(res.data.results || []);
//         setMeta(res.data.meta);
//       }
//       if (current !== meta.current) {
//         fetchPosts();
//       }

//       // Filter posts based on status if needed
//       let filteredPosts = posts;
//       if (statusFilter !== "all") {
//         filteredPosts = posts.filter(
//           (post: any) => post.post_status === statusFilter
//         );
//       }

//       // Filter by search term if provided
//       if (searchTerm) {
//         const term = searchTerm.toLowerCase();
//         filteredPosts = filteredPosts.filter(
//           (post: any) =>
//             post.title.toLowerCase().includes(term) ||
//             post.description.toLowerCase().includes(term)
//         );
//       }

//       console.log('>>>searchTerm: ', searchTerm);
//       console.log('>>>filteredPosts: ', filteredPosts);


//       setPosts(filteredPosts);
//       setTotalPages(Math.ceil(filteredPosts.length / postsPerPage));
//     } catch (error) {
//       console.error("Error with posts data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = () => {
//     setCurrentPage(1); // Reset to first page when searching
//     fetchPosts();
//   };

//   const handleDeleteClick = (postId: string) => {
//     setPostToDelete(postId);
//     setDeleteDialogOpen(true);
//   };


//   const confirmDelete = async () => {
//     if (!postToDelete) return;

//     try {
//       const res = await handleDeletePost(postToDelete)
//       if (res?.data) {
//         console.log('>>>res: ', res);
//         toast.success("Post deleted successfully")
//       } else {
//         console.log('>>>res: ', res);
//         toast.error("Error while deleting post")
//       }
//       setPosts(posts.filter((post: any) => post.id !== postToDelete));
//       setDeleteDialogOpen(false);
//       setPostToDelete(null);
//     } catch (error) {
//       console.error("Error deleting post:", error);
//     }
//   };

//   const getStatusBadge = (status: string, scheduledAt: string | null) => {
//     if (status === "published") {
//       return <Badge className="bg-green-500">Published</Badge>;
//     } else if (status === "draft") {
//       return (
//         <Badge variant="outline" className="text-gray-500">
//           Draft
//         </Badge>
//       );
//     } else if (status === "scheduled" || scheduledAt) {
//       return <Badge className="bg-blue-500">Scheduled</Badge>;
//     } else if (status === "pending") {
//       return <Badge className="bg-yellow-500">Pending</Badge>;
//     } else {
//       return <Badge variant="outline">{status}</Badge>;
//     }
//   };

//   const getStatusIcon = (status: string, scheduledAt: string | null) => {
//     if (status === "published") {
//       return <CheckCircle2 className="h-4 w-4 text-green-500" />;
//     } else if (status === "draft") {
//       return <AlertCircle className="h-4 w-4 text-gray-500" />;
//     } else if (status === "scheduled" || scheduledAt) {
//       return <Calendar className="h-4 w-4 text-blue-500" />;
//     } else if (status === "pending") {
//       return <Clock className="h-4 w-4 text-yellow-500" />;
//     }
//     return null;
//   };  


//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold">All Posts</h1>
//         <Button onClick={() => router.push("/dashboard/post")}>
//           <Plus className="mr-2 h-4 w-4" /> New Post
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Posts</CardTitle>
//           <CardDescription>
//             Manage your blog posts, articles, and other content.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col space-y-4">
//             <div className="flex flex-col sm:flex-row justify-between gap-4">
//               <div className="flex flex-1 items-center space-x-2">
//                 <Input
//                   placeholder="Search posts..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="max-w-sm"
//                 />
//                 <Button onClick={handleSearch} variant="outline" size="icon">
//                   <Search className="h-4 w-4" />
//                 </Button>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Filter by status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Status</SelectItem>
//                     <SelectItem value="published">Published</SelectItem>
//                     <SelectItem value="draft">Draft</SelectItem>
//                     <SelectItem value="scheduled">Scheduled</SelectItem>
//                     <SelectItem value="pending">Pending</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={() => setIsFilterOpen(true)}
//                 >
//                   <Filter className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>

//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="w-[300px]">Title</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Author</TableHead>
//                     <TableHead>Categories</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead className="text-right">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {loading ? (
//                     <TableRow>
//                       <TableCell colSpan={6} className="text-center py-10">
//                         Loading posts...
//                       </TableCell>
//                     </TableRow>
//                   ) : posts.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={6} className="text-center py-10">
//                         No posts found. Create your first post!
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     posts.map((post: any) => (
//                       <TableRow key={post.id || `post-${Math.random()}`}>
//                         <TableCell className="font-medium">
//                           <div className="flex items-center space-x-2">
//                             {post.feature_image && (
//                               <div
//                                 key={`extra-x-${post.slug}`}
//                                 className="h-10 w-10 rounded overflow-hidden flex-shrink-0"
//                               >
//                                 <Image
//                                   src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${post.feature_image}`}
//                                   alt={post.title}
//                                   width={40}
//                                   height={40}
//                                   className="h-full w-full object-cover"
//                                 />
//                               </div>
//                             )}
//                             <div className="flex flex-col">
//                               <span className="truncate max-w-[250px]">
//                                 {post.title}
//                               </span>
//                               <span className="text-xs text-muted-foreground truncate max-w-[250px]">
//                                 /{post.slug}
//                               </span>
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex items-center space-x-2">
//                             {getStatusIcon(post.post_status, post.scheduled_at)}
//                             {getStatusBadge(
//                               post.post_status,
//                               post.scheduled_at
//                             )}
//                           </div>
//                         </TableCell>
//                         <TableCell>{post.author || "Unknown"}</TableCell>
//                         <TableCell>
//                           <div className="flex flex-wrap gap-1">
//                             {post.categories
//                               ?.slice(0, 2)
//                               .map((category: any, index: number) => (
//                                 <Badge
//                                   key={`${post.id}-${
//                                     category.id || category.name
//                                   }-${index}`}
//                                   variant="outline"
//                                   className="text-xs"
//                                 >
//                                   {category}
//                                 </Badge>
//                               ))}
//                             {post.categories && post.categories.length > 2 && (
//                               <Badge
//                                 key={`extra-${post.slug}`}
//                                 variant="outline"
//                                 className="text-xs"
//                               >
//                                 +{post.categories.length - 2}
//                               </Badge>
//                             )}
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           {post.scheduled_at ? (
//                             <div className="flex flex-col">
//                               <span className="text-xs text-muted-foreground">
//                                 Scheduled for
//                               </span>
//                               <span>
//                                 {format(
//                                   new Date(post.scheduled_at),
//                                   "dd-MM-yyyy"
//                                 )}
//                               </span>
//                             </div>
//                           ) : post.post_status === "published" ? (
//                             <div className="flex flex-col">
//                               <span className="text-xs text-muted-foreground">
//                                 Published on
//                               </span>
//                               <span>
//                                 {format(
//                                   new Date(post.create_at),
//                                   "MMM d, yyyy"
//                                 )}
//                               </span>
//                             </div>
//                           ) : (
//                             <div className="flex flex-col">
//                               <span className="text-xs text-muted-foreground">
//                                 Last updated
//                               </span>
//                               <span>
//                                 {format(
//                                   new Date(post.create_at),
//                                   "MMM d, yyyy"
//                                 )}
//                               </span>
//                             </div>
//                           )}
//                         </TableCell>
//                         <TableCell className="text-right">
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button variant="ghost" size="icon">
//                                 <MoreHorizontal className="h-4 w-4" />
//                                 <span className="sr-only">Open menu</span>
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end">
//                               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                               <DropdownMenuItem
//                                 onClick={() =>
//                                   router.push(`/blog/${post.slug}`)
//                                 }
//                               >
//                                 <Eye className="mr-2 h-4 w-4" />
//                                 View
//                               </DropdownMenuItem>
//                               <DropdownMenuItem
//                                 onClick={() =>
//                                   router.push(`/dashboard/post/edit/${post.id}`)                                  
//                                 }
//                               >
//                                 <Edit className="mr-2 h-4 w-4" />
//                                 Edit
//                               </DropdownMenuItem>
//                               <DropdownMenuSeparator />
//                               <DropdownMenuItem
//                                 className="text-red-600"
//                                 onClick={() => handleDeleteClick(post.id)}
//                               >
//                                 <Trash2 className="mr-2 h-4 w-4" />
//                                 Delete
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>

//             <div className="flex items-center justify-between">
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Showing {(meta.current - 1) * meta.pageSize + 1} to{" "}
//                 {Math.min(meta.current * meta.pageSize, meta.total)} of{" "}
//                 {meta.total} entries
//               </p>
//               <Pagination
//                 currentPage={meta.current}
//                 totalPages={meta.pages}
//                 onPageChange={handlePageChange}
//               />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Advanced Filter Dialog */}
//       <PostsFilter
//         open={isFilterOpen}
//         onOpenChange={setIsFilterOpen}
//         onApplyFilters={fetchPosts}
//       />

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>
//               Are you sure you want to delete this post?
//             </DialogTitle>
//             <DialogDescription>
//               This action cannot be undone. This will permanently delete the
//               post and remove it from our servers.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setDeleteDialogOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={confirmDelete}>
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default AllPostManage;

"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { PostsFilter } from "./posts-filter"
import Image from "next/image"
import { handleDeletePost, type RawPost } from "@/utils/action"
import { sendRequest } from "@/utils/api"
import { toast } from "sonner"

interface IProps {
  initialPosts: RawPost[]
  initialMeta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
}

const AllPostManage = (props: IProps) => {
  const { initialPosts, initialMeta } = props
  const [meta, setMeta] = useState(initialMeta)

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState(initialPosts)

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)

  const current = Number(searchParams.get("current")) || 1
  const pageSize = Number(searchParams.get("pageSize")) || initialMeta.pageSize

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/custom`,
        method: "GET",
        queryParams: {
          current,
          pageSize,
          search: searchParams.get("search") || "",
          status: statusFilter !== "all" ? statusFilter : undefined,
        },
      })
      if (res.statusCode === 200) {
        setPosts(res.data.results || [])
        setMeta(res.data.meta)
      }
    }
    fetchPosts()
  }, [current, pageSize, searchParams.get("search"), statusFilter])

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("current", page.toString())
    replace(`${pathname}?${params.toString()}`)
  }

  // Pagination settings
  const postsPerPage = 10

  // Fetch posts on component mount and when filters change
  useEffect(() => {
    fetchPosts()
  }, [currentPage, statusFilter])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      // Include searchTerm in the API request
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/custom`,
        method: "GET",
        queryParams: {
          current,
          pageSize,
          search: searchTerm, // Add search parameter
          status: statusFilter !== "all" ? statusFilter : undefined, // Add status filter
        },
      })

      if (res.statusCode === 200) {
        setPosts(res.data.results || [])
        setMeta(res.data.meta)
      }

      console.log(">>>searchTerm: ", searchTerm)
      console.log(">>>posts after search: ", res.data.results)
    } catch (error) {
      console.error("Error with posts data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams)
    params.set("current", "1") // Reset to first page when searching
    if (searchTerm) {
      params.set("search", searchTerm)
    } else {
      params.delete("search")
    }
    replace(`${pathname}?${params.toString()}`)
  }

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!postToDelete) return

    try {
      const res = await handleDeletePost(postToDelete)
      if (res?.data) {
        console.log(">>>res: ", res)
        toast.success("Post deleted successfully")
      } else {
        console.log(">>>res: ", res)
        toast.error("Error while deleting post")
      }
      setPosts(posts.filter((post: any) => post.id !== postToDelete))
      setDeleteDialogOpen(false)
      setPostToDelete(null)
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const getStatusBadge = (status: string, scheduledAt: string | null) => {
    if (status === "published") {
      return <Badge className="bg-green-500">Published</Badge>
    } else if (status === "draft") {
      return (
        <Badge variant="outline" className="text-gray-500">
          Draft
        </Badge>
      )
    } else if (status === "scheduled" || scheduledAt) {
      return <Badge className="bg-blue-500">Scheduled</Badge>
    } else if (status === "pending") {
      return <Badge className="bg-yellow-500">Pending</Badge>
    } else {
      return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string, scheduledAt: string | null) => {
    if (status === "published") {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    } else if (status === "draft") {
      return <AlertCircle className="h-4 w-4 text-gray-500" />
    } else if (status === "scheduled" || scheduledAt) {
      return <Calendar className="h-4 w-4 text-blue-500" />
    } else if (status === "pending") {
      return <Clock className="h-4 w-4 text-yellow-500" />
    }
    return null
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">All Posts</h1>
        <Button onClick={() => router.push("/dashboard/post")}>
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
          <CardDescription>Manage your blog posts, articles, and other content.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex flex-1 items-center space-x-2">
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Button onClick={handleSearch} variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={() => setIsFilterOpen(true)}>
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        Loading posts...
                      </TableCell>
                    </TableRow>
                  ) : posts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        No posts found. Create your first post!
                      </TableCell>
                    </TableRow>
                  ) : (
                    posts.map((post: any) => (
                      <TableRow key={post.id || `post-${Math.random()}`}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            {post.feature_image && (
                              <div
                                key={`extra-x-${post.slug}`}
                                className="h-10 w-10 rounded overflow-hidden flex-shrink-0"
                              >
                                <Image
                                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${post.feature_image}`}
                                  alt={post.title}
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="truncate max-w-[250px]">{post.title}</span>
                              <span className="text-xs text-muted-foreground truncate max-w-[250px]">/{post.slug}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(post.post_status, post.scheduled_at)}
                            {getStatusBadge(post.post_status, post.scheduled_at)}
                          </div>
                        </TableCell>
                        <TableCell>{post.author || "Unknown"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {post.categories?.slice(0, 2).map((category: any, index: number) => (
                              <Badge
                                key={`${post.id}-${category.id || category.name}-${index}`}
                                variant="outline"
                                className="text-xs"
                              >
                                {category}
                              </Badge>
                            ))}
                            {post.categories && post.categories.length > 2 && (
                              <Badge key={`extra-${post.slug}`} variant="outline" className="text-xs">
                                +{post.categories.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {post.scheduled_at ? (
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Scheduled for</span>
                              <span>{format(new Date(post.scheduled_at), "dd-MM-yyyy")}</span>
                            </div>
                          ) : post.post_status === "published" ? (
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Published on</span>
                              <span>{format(new Date(post.create_at), "MMM d, yyyy")}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Last updated</span>
                              <span>{format(new Date(post.create_at), "MMM d, yyyy")}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => router.push(`/blog/${post.slug}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/post/edit/${post.id}`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(post.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(meta.current - 1) * meta.pageSize + 1} to {Math.min(meta.current * meta.pageSize, meta.total)}{" "}
                of {meta.total} entries
              </p>
              <Pagination currentPage={meta.current} totalPages={meta.pages} onPageChange={handlePageChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filter Dialog */}
      <PostsFilter open={isFilterOpen} onOpenChange={setIsFilterOpen} onApplyFilters={fetchPosts} />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the post and remove it from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AllPostManage

