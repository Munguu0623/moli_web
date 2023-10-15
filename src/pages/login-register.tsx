import { useEffect } from "react";
import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import SEO from "@components/seo/page-seo";
import Layout from "@layout/layout-01";
import Breadcrumb from "@components/breadcrumb";
import LoginForm from "@components/forms/login-form";
import RegisterForm from "@components/forms/register-form";
import Spinner from "@ui/spinner";
import { useUser } from "@contexts/user-context";
import { useMount } from "@hooks";

type PageProps = NextPage & {
    Layout: typeof Layout;
};

const LoginRegister: PageProps = () => {
    const mounted = useMount();
    const { isLoggedIn } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            void router.push("/profile");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    if (!mounted) return null;

    if (isLoggedIn) {
        return (
            <>
                <SEO title="Login Register" />
                <Breadcrumb
                    pages={[{ path: "/", label: "home" }]}
                    currentPage="Profile"
                    showTitle={false}
                />
                <div className=" tw-flex tw-justify-around">
                    <div className=" tw-w-[470px]">
                        <LoginForm />
                    </div>
                    <div className="tw-w-[570px] tw-mb-36">
                        <RegisterForm />
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="tw-fixed tw-bg-light-100 tw-top-0 tw-z-50 tw-w-screen tw-h-screen tw-flex tw-justify-center tw-items-center">
            <Spinner />
        </div>
    );
};

LoginRegister.Layout = Layout;

export const getStaticProps: GetStaticProps = () => {
    return {
        props: {
            layout: {
                headerShadow: true,
                headerFluid: false,
                footerMode: "light",
            },
        },
    };
};

export default LoginRegister;
