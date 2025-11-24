import { auth } from "@/auth";
import AllQuizManage from "@/components/admin/quizzes/all-quizzes";
import { sendRequest } from "@/utils/api";

interface IProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const QuizzesPage = async (props: IProps) => {
  const searchParams = await props?.searchParams;
  console.log(">>>searchParams: ", searchParams);
  let current = Number(searchParams?.current) || 1;
  const pageSize = (await Number(searchParams?.pageSize)) || 10;
  const session = await auth();

  let res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quizzes/paginate`,
      method: "GET",
      queryParams: {
        current,
        pageSize,
      },
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
      nextOption: {
        next: { tags: ["list-quizzes"] },
      },
    });
  
    if (res?.data?.results.length === 0 && current > 1) {
      current = 1;
      res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quizzes/paginate`,
        method: "GET",
        queryParams: { current, pageSize },
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        nextOption: { next: { tags: ["list-quizzes"] } },
      });
    }
    console.log(">>>res: ", res);

  return (
    // <AllQuizManage
    //   initialQuizzes={res?.data?.results ?? []}
    //   initialMeta={res?.data?.meta ?? {
    //     current: 1,
    //     pageSize: 10,
    //     pages: 1,
    //     total: 0
    //   }}
    // />
    <AllQuizManage
      initialQuizzes={res?.data?.results ?? []}
      initialMeta={res?.data?.meta}
    />
  )
};

export default QuizzesPage;