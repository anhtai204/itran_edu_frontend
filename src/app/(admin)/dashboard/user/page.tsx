
import { auth } from "@/auth";
import UserTableModal from "@/components/admin/user-table-modal";
import UserTable from "@/components/admin/user.table";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";

interface IProps {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}
const ManageUserPage = async (props: IProps) => {

    const searchParams = await props?.searchParams;
    console.log('>>>searchParams: ', searchParams);
    let current = Number(searchParams?.current) || 1;
    const pageSize = await Number(searchParams?.pageSize) || 10;
    const session = await auth();

    let res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/postgres`,
        method: "GET",
        queryParams: {
            current,
            pageSize
        },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ['list-users'] }
        }
    })

    if (res?.data?.results.length === 0 && current > 1) {
        current = 1;
        res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/postgres`,
            method: "GET",
            queryParams: { current, pageSize },
            headers: { Authorization: `Bearer ${session?.user?.access_token}` },
            nextOption: { next: { tags: ['list-users'] } }
        });
    }

    console.log('>>>users paginate: ', res);

    return (
        <div>
            {/* <UserTable
                users={res?.data?.results ?? []}
                meta={res?.data?.meta}
            /> */}

            <UserTableModal
                users={res?.data?.results ?? []}
                meta={res?.data?.meta}
            />
        </div>
    )
}

export default ManageUserPage;