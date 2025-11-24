import { auth } from "@/auth";
import { NewsPage } from "@/components/article/article";
import CreateNewsPage from "@/components/news/create-news";

const NewsManage = async () => {

    const session  = await auth();

    return (
        <>
            <CreateNewsPage session={session} />
        </>
    )
}

export default NewsManage;