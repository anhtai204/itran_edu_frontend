import { auth } from '@/auth';
import { UserContextProvider } from '@/library/user.context';
import UserSideBar from '@/components/layout/(user)/user.sidebar';
import UserHeader from '@/components/layout/(user)/user.header';
import UserContent from '@/components/layout/(user)/user.content';
import UserFooter from '@/components/layout/(user)/user.footer';

const UserLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    const session = await auth();

    return (
        <UserContextProvider>
            <div style={{ display: "flex" }}>
                <div className='left-side' style={{ minWidth: 80 }}>
                    <UserSideBar />
                </div>
                <div className='right-side' style={{ flex: 1 }}>
                    <UserHeader session={session} />
                    <UserContent>
                        {children}
                    </UserContent>
                    <UserFooter />
                </div>
            </div>
        </UserContextProvider>
    )
}

export default UserLayout;