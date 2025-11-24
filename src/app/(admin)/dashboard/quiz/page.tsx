import { auth } from "@/auth";
import CreateQuizPage from "@/components/admin/quizzes/quiz-create";

const QuizManage = async () => {

    const session  = await auth();

    return (
        <>
            <CreateQuizPage session={session} />
        </>
    )
}

export default QuizManage;