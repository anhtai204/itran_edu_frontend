import { auth } from "@/auth";
import { sendRequest } from "@/utils/api";
import QuizLevelsModal from "@/components/quiz_levels/quiz-level-modal";

interface IProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const QuizLevelsManage = async (props: IProps) => {
  const searchParams = await props?.searchParams;
  let current = Number(searchParams?.current) || 1;
  const pageSize = (await Number(searchParams?.pageSize)) || 10;
  const session = await auth();

  let res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/difficulties/paginate`,
    method: "GET",
    queryParams: {
      current,
      pageSize,
    },
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    nextOption: {
      next: { tags: ["list-difficulties"] },
    },
  });

  console.log('>>>res difficulties: ', res);

  return (
    <div>
      <QuizLevelsModal levels={res?.data?.results ?? []} meta={res?.data?.meta} />
    </div>
  );
};

export default QuizLevelsManage;