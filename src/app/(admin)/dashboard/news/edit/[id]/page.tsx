import { auth } from "@/auth";
import EditNewsPage from "@/components/news/edit-news";

const EditNewsManage = async () => {
  const session = await auth();

  return <EditNewsPage />;
};
export default EditNewsManage;
