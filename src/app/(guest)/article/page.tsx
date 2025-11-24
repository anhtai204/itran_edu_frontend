import type { Metadata } from "next";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { NewsPage } from "@/components/article/article";
import { sendRequest } from "@/utils/api";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "News | Itran Education",
  description:
    "Stay updated with the latest news and announcements from Itran Education",
};

interface IProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const getCategoriesForNews = async () => {
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/news/each-news`,
    method: "GET",
  });

  if (res.statusCode === 200 && Array.isArray(res.data)) {
    return res.data;
  }
};

const News = async (props: IProps) => {
  const categories = (await getCategoriesForNews()) || [];

  const searchParams = await props?.searchParams;
  console.log(">>>searchParams: ", searchParams);
  let current = Number(searchParams?.current) || 1;
  const pageSize = (await Number(searchParams?.pageSize)) || 6;
  const session = await auth();

  let res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/news/custom`,
    method: "GET",
    queryParams: {
      current,
      pageSize,
    },
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    nextOption: {
      next: { tags: ["list-news"] },
    },
  });

  if (res?.data?.results.length === 0 && current > 1) {
    current = 1;
    res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/news/custom`,
      method: "GET",
      queryParams: { current, pageSize },
      headers: { Authorization: `Bearer ${session?.user?.access_token}` },
      nextOption: { next: { tags: ["list-news"] } },
    });
  }
  console.log(">>>res: ", res);

  return (
    <>
      <Header />
      <NewsPage
        initialNews={res?.data?.results ?? []}
        initialMeta={res?.data?.meta}
        categories={categories}
      />
      <Footer />
    </>
  );
};

export default News;
