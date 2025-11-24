import { auth } from "@/auth";
import EditQuizPage from "@/components/admin/quizzes/edit-quiz";

const EditQuizManage = async () => {
  const session = await auth();

  return <EditQuizPage session={session} />;
};
export default EditQuizManage;
