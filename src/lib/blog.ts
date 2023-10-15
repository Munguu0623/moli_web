import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import dayjs from "dayjs";
import { IBlog, BlogMetaType, IDType } from "@utils/types";
import { slugify, flatDeep } from "@utils/methods";
import { getSlugs } from "./util";
import { getAuthorByID } from "./author";
import { Blogs, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
type BlogsWhereUniqueInput = Prisma.BlogsWhereUniqueInput & {
    id: number;
};
// interface BlogType extends Omit<IBlog, "category" | "tags" | "author"> {
//     category: string;
//     tags: string[];
//     author: IDType;
// }
// const postsDirectory = join(process.cwd(), "src/data/blogs");

const makeExcerpt = (str: string | null | undefined, maxLength: number): string => {
    if (!str) return ""
    if (str.length <= maxLength) {
        return str;
    }
    let excerpt = str.substring(0, maxLength);
    excerpt = excerpt.substring(0, excerpt.lastIndexOf(" "));
    return `${excerpt} ...`;
};

export async function getBlogById(
    id: number,

): Promise<IBlog> {

    const blogData = await prisma.blogs.findUnique(
        {
            where: { id } as BlogsWhereUniqueInput,
            include: {
                Category: true,
                Users: true
            }
        }
    )
    // const blogData = data as BlogType;
    if (!blogData) {
        // Handle case where the blog post is not found
        throw new Error(`Blog post with slug ${id} not found.`);
    }
    return {
        ...blogData,
        createdDate: blogData.createdDate.toString(),
        modifiedDate: blogData.modifiedDate.toString(),
        category: {
            id: blogData.Category?.id,
            name: blogData.Category?.name,
            path: `/blogs/category/${blogData.Category?.name}`
        },
        author: {
            id: blogData.authorId,
            firstName: blogData.Users?.firstName,
            password: blogData.Users?.password,
            phoneNumber: blogData.Users?.phoneNumber,
            email: blogData.Users?.email,
            createdDate: blogData.Users?.createdDate.toString(),
            modifiedDate: blogData.Users?.modifiedDate?.toString(),
        },
        views: 2,
        excerpt: makeExcerpt(blogData?.content, 150),
        path: `/blogs/${blogData.slug}`,
    };
}

export async function getAllBlogs(
    skip = 0,
    limit?: number
) {
    const blog = await prisma.blogs.findMany({
        orderBy: {
            createdDate: "desc",
        },
        include: {
            Category: true,
            Users: true,
        },
        skip,
        take: limit,
    })
    console.log('blogs with user---->', blog)
    // let blogs  IBlog
    // const slugs = getSlugs(postsDirectory);
    // let blogs = slugs
    //     .map((slug) => getPostBySlug(slug, fields))
    //     .sort((post1, post2) =>
    //         new Date(post1.createdDate).getTime() >
    //         new Date(post2.createdDate).getTime()
    //             ? -1
    //             : 1
    //     );
    // if (limit) blogs = blogs.slice(skip, skip + limit);
    // let blogs = await Promise.all(
    // blog.map((blog) => getBlogById(blog.id))
    // );
    const blogtest = await Promise.all(
        blog.map((blog) => getBlogById(blog.id))
    );
    let blogs = JSON.parse(JSON.stringify(blogtest))
    return { blogs, count: blogs.length };
}

// export async function getPrevNextPost(
//     currentSlug: string,
// ) {
//     const { blogs } = await getAllBlogs();
//     const currentIndex = blogs.findIndex((post) => post.slug === currentSlug);
//     const prevPost = blogs[currentIndex - 1] || null;
//     const nextPost = blogs[currentIndex + 1] || null;
//     return { prevPost, nextPost };
// }

// export async function getTags() {
//     const { blogs } = await getAllBlogs(["tags"]);
//     const tags = flatDeep<BlogMetaType>(blogs.map((post) => post.tags));
//     const result: BlogMetaType[] = [];

//     tags.forEach((tag) => {
//         if (!result.find((t) => t.title === tag.title)) {
//             result.push(tag);
//         }
//     });

//     return result;
// }

// export async function getPostsByCategory(
//     category: string,
//     fields: Array<keyof IBlog> | "all" = [],
//     skip = 0,
//     limit?: number
// ) {
//     const postFields =
//         fields === "all"
//             ? "all"
//             : ([...fields, "category"] as Array<keyof IBlog>);
//     const { blogs} = await getAllBlogs(postFields);
//     let result = blogs.filter((post) => post.category.slug === category);
//     const totalPosts = result.length;
//     if (limit) result = result.slice(skip, skip + limit);
//     return { posts: result, count: totalPosts };
// }

// export async function getPostsByTag(
//     tag: string,
//     fields: Array<keyof IBlog> | "all" = [],
//     skip = 0,
//     limit?: number
// ) {
//     const postFields =
//         fields === "all" ? "all" : ([...fields, "tags"] as Array<keyof IBlog>);
//     const { blogstest} = await getAllBlogs(postFields);
//     let result = blogs.filter((post) => post.tags.some((t) => t.slug === tag));
//     const totalPosts = result.length;
//     if (limit) result = result.slice(skip, skip + limit);
//     return { posts: result, count: totalPosts };
// }

export async function getPostsByAuthor(
    authorID: IDType,
    skip = 0,
    limit?: number
) {
    // const postFields =
    //     fields === "all"
    //         ? "all"
    //         : ([...fields, "author"] as Array<keyof IBlog>);
    let blogs = await prisma.blogs.findMany({
        where: {
            authorId: authorID
        }
    });
    // let result = blogs.filter((post) => post.authorId === authorID);
    // const totalPosts = result.length;
    if (limit) blogs = blogs.slice(skip, skip + limit);
    return { posts: blogs, count: blogs.length };
}
