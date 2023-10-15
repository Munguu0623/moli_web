import type {
    GetServerSideProps,
    GetServerSidePropsContext,
    NextPage,
} from "next";
import SEO from "@components/seo/page-seo";
import Layout01 from "@layout/layout-01";
import Breadcrumb from "@components/breadcrumb";
import BlogArea from "@containers/blog-full/layout-02";
import { unslugify, toCapitalize } from "@utils/methods";
import { BlogMetaType, IBlog } from "@utils/types";
import {
    getAllBlogs,
    getAllCategories,
    getBlogByCategory,
} from "../../../../lib/blog";

type TProps = {
    data: {
        blogs: IBlog[];
        recentPosts: IBlog[];
        category: BlogMetaType[];
        pageTitle: string;
        slug: string;
        currentPage: number;
        numberOfPages: number;
    };
};

type PageProps = NextPage<TProps> & {
    Layout: typeof Layout01;
};

const POSTS_PER_PAGE = 8;

const BlogCategoryPage: PageProps = ({
    data: {
        blogs,
        recentPosts,
        category,
        pageTitle,
        slug,
        currentPage,
        numberOfPages,
    },
}) => {
    return (
        <>
            <SEO title={toCapitalize(pageTitle)} />
            <Breadcrumb
                pages={[
                    { path: "/", label: "Нүүр" },
                    { path: "/blogs/blog-grid-sidebar", label: "Мэргэжлүүд" },
                ]}
                currentPage={pageTitle}
                title={`Ангилал: ${pageTitle}`}
            />
            <BlogArea
                data={{
                    blogs,
                    recentPosts,
                    category,
                    pagiData: {
                        currentPage,
                        numberOfPages,
                        rootPage: `blogs/category/${slug}`,
                    },
                }}
            />
        </>
    );
};

BlogCategoryPage.Layout = Layout01;

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const params = context.params as { category: string };
    const { blogs, count } = await getBlogByCategory(params.category);
    const { blogs: recentPosts } = await getAllBlogs(0, 5);
    const { category } = await getAllCategories();
    return {
        props: {
            data: {
                blogs,
                recentPosts,
                category,
                pageTitle: unslugify(params.category),
                slug: params.category,
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

export default BlogCategoryPage;
