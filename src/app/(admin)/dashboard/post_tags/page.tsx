import { auth } from "@/auth";
import PostTagsModal from "@/components/post_tags/post-tag-modal";
import { sendRequest } from "@/utils/api";

interface IProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const PostTagsManage = async (props: IProps) => {
  const searchParams = await props?.searchParams;
  console.log(">>>searchParams: ", searchParams);
  let current = Number(searchParams?.current) || 1;
  const pageSize = (await Number(searchParams?.pageSize)) || 10;
  const session = await auth();

  let res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-tags/paginate`,
    method: "GET",
    queryParams: {
      current,
      pageSize,
    },
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    nextOption: {
      next: { tags: ["list-tags"] },
    },
  });

  console.log('>>>res post_tag: ', res);

  return (
    <div>
      <PostTagsModal tags={res?.data?.results ?? []} meta={res?.data?.meta} />
    </div>
  );
};

export default PostTagsManage;