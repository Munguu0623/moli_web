import { useState, useEffect, useCallback } from "react";
import type { GetServerSideProps, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import SEO from "@components/seo/page-seo";
import Spinner from "@ui/spinner";
import Layout01 from "@layout/layout-01";
import Breadcrumb from "@components/breadcrumb";
import BlogArea from "@containers/blog-full/layout-05";
import { BlogMetaType, IBlog } from "@utils/types";
import { getAllBlogs, getAllCategories, searchBlogs } from "../../../lib/blog";

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

const BlogSearch: PageProps = ({ data }) => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const router = useRouter();
    const { s } = router.query;

    const filterCourses = useCallback(() => {
        if (s) {
            const search = (s as string).toLowerCase();
            const filteredCourses = data.blogs?.filter((blog) => {
                const { title, category, content } = blog;
                return (
                    title.toLowerCase().includes(search) ||
                    category.name === search ||
                    content?.toLowerCase().includes(search)
                );
            });
            setBlogs(filteredCourses);
        }
    }, [data.blogs, s]);

    useEffect(() => {
        filterCourses();
        setLoading(false);
    }, [filterCourses]);

    if (loading) {
        return (
            <div className="tw-w-full tw-h-screen tw-flex tw-justify-center tw-items-center">
                <Spinner />
            </div>
        );
    }
    const title = s ? `Хайлтын утга: ${s as string}` : "Хайлт";
    return (
        <>
            <SEO title={title} />
            <Breadcrumb
                pages={[{ path: "/", label: "Нүүр" }]}
                currentPage={title}
            />
            <BlogArea
                data={{
                    blogs,
                    recentPosts: data.recentPosts,
                    category: data.category,
                    pagiData: {
                        currentPage: data.currentPage,
                        numberOfPages: data.numberOfPages,
                        rootPage: `blogs/search`,
                    },
                }}
            />
        </>
    );
};

BlogSearch.Layout = Layout01;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { blogs } = await searchBlogs(context.query.s as string);
    const { count } = await getAllBlogs(0, POSTS_PER_PAGE);
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

export default BlogSearch;
