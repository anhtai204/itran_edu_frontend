import { auth } from "@/auth";
import CreatePostsPage from "@/components/post/create-post-test";

const PostManage = async () => {

    const session  = await auth();

    return (
        <>
            <CreatePostsPage session={session} />
        </>
    )
}

export default PostManage;