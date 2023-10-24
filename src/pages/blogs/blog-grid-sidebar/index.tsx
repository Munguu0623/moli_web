import type { GetStaticProps, NextPage } from "next";
import SEO from "@components/seo/page-seo";
import Layout01 from "@layout/layout-01";
import Breadcrumb from "@components/breadcrumb";
import BlogArea from "@containers/blog-full/layout-02";
import { BlogMetaType, IBlog } from "@utils/types";
import { getAllBlogs, getAllCategories } from "../../../lib/blog";

type TProps = {
    data: {
        blogs: IBlog[];
        recentPosts: IBlog[];
        category: BlogMetaType[];
        currentPage: number;
        numberOfPages: number;
    };
};

type PageProps = NextPage<TProps> & {
    Layout: typeof Layout01;
};

const POSTS_PER_PAGE = 8;

const BlogGridSidebar: PageProps = ({
    data: { blogs, recentPosts, category, currentPage, numberOfPages },
}) => {
    return (
        <>
            <SEO title="Blogs" />
            <Breadcrumb
                pages={[{ path: "/", label: "Нүүр" }]}
                currentPage="Нийтлэлүүд"
            />
            <BlogArea
                data={{
                    blogs,
                    recentPosts,
                    category,
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
    const { blogs, count } = await getAllBlogs(0, POSTS_PER_PAGE);
    const { blogs: recentPosts } = await getAllBlogs(0, 5);
    const { category } = await getAllCategories();
    return {
        props: {
            data: {
                blogs,
                recentPosts,
                category,
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
