import Login from "@/components/auth/login";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

const LoginPage = async () => {
    return (
        <>
            <Header />
            <Login />
            <Footer />
        </>
    )
}

export default LoginPage;