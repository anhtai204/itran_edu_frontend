import Footer from "@/components/layout/footer";
import BlogMain from "@/components/blog/blogs";
import { sendRequest } from "@/utils/api";
import { auth } from "@/auth";
import HeaderCheckLogin from "@/components/layout/header";

interface IProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const getCategoriesForPost = async () => {
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/each-post`,
    method: "GET",
  });

  if (res.statusCode === 200 && Array.isArray(res.data)) {
    return res.data;
  }
};

const BlogPage = async (props: IProps) => {
  const categories = (await getCategoriesForPost()) || [];

  const searchParams = await props?.searchParams;
  console.log(">>>searchParams: ", searchParams);
  let current = Number(searchParams?.current) || 1;
  const pageSize = (await Number(searchParams?.pageSize)) || 6;
  const session = await auth();

  let res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/custom`,
    method: "GET",
    queryParams: {
      current,
      pageSize,
    },
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    nextOption: {
      next: { tags: ["list-posts"] },
    },
  });

  if (res?.data?.results.length === 0 && current > 1) {
    current = 1;
    res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/custom`,
      method: "GET",
      queryParams: { current, pageSize },
      headers: { Authorization: `Bearer ${session?.user?.access_token}` },
      nextOption: { next: { tags: ["list-posts"] } },
    });
  }
  console.log(">>>res: ", res);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white dark:from-purple-900 dark:to-gray-800">
      <HeaderCheckLogin />
      {/* <BlogMain categories={categories} posts={posts} /> */}
      <BlogMain
        initialPosts={res?.data?.results ?? []}
        initialMeta={res?.data?.meta}
        categories={categories}
      />
      <Footer />
    </div>
  );
};

export default BlogPage;
