import { auth } from "@/auth";
import EditPostPage from "@/components/post/edit-post-test";
import { sendRequest } from "@/utils/api";
import { useParams } from "next/navigation";

const EditPostManage = async () => {
  const session = await auth();

  // return <EditPostPage session={session} />;
  return <EditPostPage />;
};
export default EditPostManage;
