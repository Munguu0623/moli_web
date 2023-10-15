import type {
    GetServerSideProps,
    GetServerSidePropsContext,
    GetStaticPaths,
    NextPage,
} from "next";
import SEO from "@components/seo/page-seo";
import Layout01 from "@layout/layout-01";
import Breadcrumb from "@components/breadcrumb";
import BlogDetailsArea from "@containers/blog-details";
import BlogAuthor from "@containers/blog-details/blog-author";
import BlogNavLinks from "@containers/blog-details/nav-links";
import DisqusComment from "@components/disqus-comment";
import BlogSidebar from "@containers/blog-details/blog-sidebar";
import { BlogMetaType, IAuthor, IBlog, IInstructor } from "@utils/types";
import { toCapitalize } from "@utils/methods";
import { getBlogById, getAllBlogs } from "../../lib/blog";
import { PrismaClient } from "@prisma/client";

type TProps = {
    data: {
        blog: IBlog;
        author: IAuthor;
        // prevAndNextPost: {
        //     prevPost: IBlog;
        //     nextPost: IBlog;
        // };
        recentPosts: IBlog[];
    };
};

type PageProps = NextPage<TProps> & {
    Layout: typeof Layout01;
};

const BlogDetails: PageProps = ({ data: { blog, recentPosts } }) => {
    console.log("blog medee---->", blog);
    return (
        <>
            {/* <SEO
                title={toCapitalize(blog.title)}
                description="This is a mighty good description of this blog."
                jsonLdType="article"
                article={{
                    publishedTime: blog.createdDate,
                    modifiedTime: blog.createdDate,
                    authors: [blog.author.firstName],
                }}
                image={`https://maxcoach-react.pages.dev${blog.image}`}
            /> */}
            <Breadcrumb
                pages={[
                    { path: "/", label: "home" },
                    {
                        path: "/blogs/blog-grid-sidebar",
                        label: "blogs",
                    },
                ]}
                currentPage={blog.title}
                title="Blog"
            />
            <div className="tw-container tw-pb-15 md:tw-pb-20 lg:tw-pb-[100px] tw-grid tw-grid-cols-3 tw-gap-7.5 lg:tw-gap-15">
                <div className="tw-col-span-full lg:tw-col-[1/3]">
                    <BlogDetailsArea {...blog} />
                    <BlogAuthor {...blog.author} />
                    {/* <BlogNavLinks {...prevAndNextPost} /> */}
                    <DisqusComment id={blog.slug} title={blog.title} />
                </div>
                <div className="tw-col-span-full lg:tw-col-[3/-1]">
                    <BlogSidebar recentPosts={recentPosts} />
                </div>
            </div>
        </>
    );
};

BlogDetails.Layout = Layout01;

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const { id } = context.params ?? {};

    if (typeof id !== "string") {
        // Handle the case where id is not a string (or not provided)
        return {
            notFound: true,
        };
    }

    const blog = await getBlogById(Number(id));
    console.log(blog, "----blog");
    //  const prevAndNextPost = getPrevNextPost(params.slug, [
    //     "title",
    //     "image",
    //     "slug",
    // ]);
    const { blogs: recentPosts } = await getAllBlogs(0, 5);

    return {
        props: {
            data: {
                blog: JSON.parse(JSON.stringify(blog)),
                recentPosts,
            },
            layout: {
                headerShadow: true,
                headerFluid: false,
                footerMode: "light",
            },
        },
    };
};

export default BlogDetails;
