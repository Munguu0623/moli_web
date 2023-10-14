import type { GetStaticProps, NextPage } from "next";
import SEO from "@components/seo/page-seo";
import Layout01 from "@layout/layout-01";
import Breadcrumb from "@components/breadcrumb";
import BlogArea from "@containers/blog-full/layout-02";
import { BlogMetaType, IBlog } from "@utils/types";
import { getAllBlogs } from "../../../lib/blog";

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
            <SEO title="Blog Grid Sidebar" />
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

export const getStaticProps: GetStaticProps = async () => {
    const { blogs, count } = await getAllBlogs(
        ["title", "image", "createdDate", "views"],
        0,
        POSTS_PER_PAGE
    );
console.log('blogs--', blogs)
    const { blogs: recentPosts } = await getAllBlogs(["title"], 0, 5);
    // const tags = getTags();
    return {
        props: {
            data: {
                blogs,
                recentPosts,
                // tags,
                currentPage: 1,
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
