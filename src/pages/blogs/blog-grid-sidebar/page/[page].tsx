import type {
    GetServerSideProps,
    GetStaticPaths,
    GetStaticProps,
    NextPage,
} from "next";
import { ParsedUrlQuery } from "querystring";
import SEO from "@components/seo/page-seo";
import Layout01 from "@layout/layout-01";
import Breadcrumb from "@components/breadcrumb";
import BlogArea from "@containers/blog-full/layout-02";
import { BlogMetaType, IBlog } from "@utils/types";
import { getAllBlogs } from "../../../../lib/blog";

type TProps = {
    data: {
        blogs: IBlog[];
        recentPosts: IBlog[];
        currentPage: number;
        numberOfPages: number;
    };
};

type PageProps = NextPage<TProps> & {
    Layout: typeof Layout01;
};

const POSTS_PER_PAGE = 8;

const BlogGridSidebar: PageProps = ({
    data: { blogs, recentPosts, currentPage, numberOfPages },
}) => {
    return (
        <>
            <SEO title={`Blog Grid Sidebar - Page - ${currentPage}`} />
            <Breadcrumb
                pages={[{ path: "/", label: "home" }]}
                currentPage="Blog Grid Sidebar"
            />
            <BlogArea
                data={{
                    blogs,
                    recentPosts,
                    pagiData: {
                        currentPage,
                        numberOfPages,
                        rootPage: "blogs/blog-grid-sidebar",
                    },
                }}
            />
        </>
    );
};

BlogGridSidebar.Layout = Layout01;

export const getStaticPaths: GetStaticPaths = async () => {
    const { count } = await getAllBlogs();
    const pages = Math.ceil(count / POSTS_PER_PAGE);

    const pagesToGenerate = [...Array(pages).keys()]
        .map((a) => {
            if (a !== 0) return a + 1;
            return null;
        })
        .filter(Boolean);

    const paths = pagesToGenerate.map((page) => {
        return { params: { page: String(page) } }; // cast page to string
    });

    return {
        paths,
        fallback: false,
    };
};

interface Params extends ParsedUrlQuery {
    page: string;
}

export const getServerSideProps: GetServerSideProps<TProps, Params> = async ({
    params,
}) => {
    const page = params?.page;
    const currentPage = !page || Number.isNaN(+page) ? 1 : +page;
    const skip = (currentPage - 1) * POSTS_PER_PAGE;
    const { blogs, count } = await getAllBlogs(skip, POSTS_PER_PAGE);

    const { blogs: recentPosts } = await getAllBlogs(0, 5);
    return {
        props: {
            data: {
                blogs,
                recentPostsx    
                currentPage,
                numberOfPages: Math.ceil(count / POSTS_PER_PAGE),
            },
            layout: {
                headerShadow: true,
                headerFluid: false,
                footerMode: "light",
            },
        },
    };
};

export default BlogGridSidebar;
