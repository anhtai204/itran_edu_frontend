import { auth } from "@/auth";
import PendingCommentsPage from "@/components/comment/approve-comments-v1";
import { sendRequest } from "@/utils/api";

interface IProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}


const CommentManage = async (props: IProps) => {
  const searchParams = await props?.searchParams;
  let current = Number(searchParams?.current) || 1;
  const pageSize = (await Number(searchParams?.pageSize)) || 10;
  const session = await auth();
  let res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post-comments/pending`,
    method: "GET",
    queryParams: {
      current,
      pageSize,
    },
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    nextOption: {
      next: { tags: ["list-comments-pending"] },
    },
  });

  console.log('>>>res comment: ', res)


  if(!(res.statusCode === 200)){
    throw new Error("Call api comments pending error");
  }

  return (
    <PendingCommentsPage
      initialComments={res?.data?.results ?? []}
      initialMeta={res?.data?.meta}
    />
  );
};

export default CommentManage;
