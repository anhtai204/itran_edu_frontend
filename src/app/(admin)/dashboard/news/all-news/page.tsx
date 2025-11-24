import { auth } from "@/auth";
import AllNewsManage from "@/components/news/all-news";
import { sendRequest } from "@/utils/api";

interface IProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const AllPostsPage = async (props: IProps) => {
  const searchParams = await props?.searchParams;
  let current = Number(searchParams?.current) || 1;
  const pageSize = (await Number(searchParams?.pageSize)) || 10;
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
    <AllNewsManage
      initialNews={res?.data?.results ?? []}
      initialMeta={res?.data?.meta}
    />
  );
};

export default AllPostsPage;
