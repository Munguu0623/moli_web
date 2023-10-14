import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import dayjs from "dayjs";
import { IBlog, BlogMetaType, IDType } from "@utils/types";
import { slugify, flatDeep } from "@utils/methods";
import { getSlugs } from "./util";
import { getAuthorByID } from "./author";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
type BlogsWhereUniqueInput = Prisma.BlogsWhereUniqueInput & {
    slug: string;
  };
interface BlogType extends Omit<IBlog, "category" | "tags" | "author"> {
    category: string;
    tags: string[];
    author: IDType;
}
const postsDirectory = join(process.cwd(), "src/data/blogs");

const makeExcerpt = (str: string | null | undefined, maxLength: number): string => {
    if(!str) return ""
    if (str.length <= maxLength) {
        return str;
    }
    let excerpt = str.substring(0, maxLength);
    excerpt = excerpt.substring(0, excerpt.lastIndexOf(" "));
    return `${excerpt} ...`;
};

export async function getPostBySlug(
    slug: string,
    fields: Array<keyof IBlog> | "all" = []
): Promise<IBlog> {
    console.log('field', fields)
    // const realSlug = slug.replace(/\.md$/, "");
    // const fullPath = join(postsDirectory, `${realSlug}.md`);
    // const fileContents = JSON.parse(
    //     JSON.stringify(fs.readFileSync(fullPath, "utf8"))
    // ) as BlogType;
    // const { data, content } = matter(fileContents);
    const blogData = await prisma.blogs.findUnique(
        {
            where: {slug} as BlogsWhereUniqueInput,
        }
    )
    // const blogData = data as BlogType;
    if (!blogData) {
        // Handle case where the blog post is not found
        throw new Error(`Blog post with slug ${slug} not found.`);
    }

    let blog: IBlog;

    // if (fields === "all") {
        blog = {
            ...blogData,
            // category: {
            //     title: blogData.category,
            //     slug: slugify(blogData.category),
            //     path: `/blogs/category/${slugify(blogData.category)}`,
            // },
            views:2,
            path:"/",
            createdDate:blogData.createdDate.toString(),
            modifiedDate:blogData.modifiedDate.toString(),
            excerpt: makeExcerpt(blogData?.content, 150),
            authorId: getAuthorByID(blogData.authorId, "all"),
        };
    // } else {
    //     blog = fields.reduce((acc: IBlog, field: keyof IBlog) => {
    //         console.log(acc)
    //         if (field === "slug") {
    //             return { ...acc, slug: slug };
    //         }
    //         if (field === "content") {
    //             return { ...acc, [field]: blogData.content };
    //         }
    //         if (field === "excerpt") {
    //             return { ...acc, excerpt: makeExcerpt(blogData.content, 150) };
    //         }
    //         if (field === "authorId") {
    //             const author = getAuthorByID(blogData.authorId, "all");
    //             return { ...acc, author };
    //         }
    //         if (field === "category") {
    //             return {
    //                 ...acc,
    //                 category: {
    //                     title: blogData.category,
    //                     slug: slugify(blogData.category),
    //                     path: `/blogs/category/${slugify(blogData.category)}`,
    //                 },
    //             };
    //         }
    //         // if (typeof data[field] !== "undefined") {
    //         //     return { ...acc, [field]: blogData[field] };
    //         // }
    //         return acc;
    //     }, <IBlog>{});
    // }

    return {
        ...blog,
        createdDate: dayjs(blogData.createdDate).format("YYYY-MM-DD"),
        path: `/blogs/${slug}`,
    };
}

export async function getAllBlogs(
    fields: Array<keyof IBlog> | "all" = [],
    skip = 0,
    limit?: number
) {
    const blogData = await prisma.blogs.findMany({
        orderBy: {
            createdDate: "desc",
          },
          skip,
          take:limit,
    })
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
    const blogs = await Promise.all(
        blogData.map((blog) => getPostBySlug(blog.slug, fields))
      );
    return { blogs, count: blogs.length };
}

export async function getPrevNextPost(
    currentSlug: string,
    fields: Array<keyof IBlog> | "all" = []
) {
    const { blogs } = await getAllBlogs(fields);
    const currentIndex = blogs.findIndex((post) => post.slug === currentSlug);
    const prevPost = blogs[currentIndex - 1] || null;
    const nextPost = blogs[currentIndex + 1] || null;
    return { prevPost, nextPost };
}

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
    fields: Array<keyof IBlog> | "all" = [],
    skip = 0,
    limit?: number
) {
    const postFields =
        fields === "all"
            ? "all"
            : ([...fields, "author"] as Array<keyof IBlog>);
    const { blogs } = await getAllBlogs(postFields);
    let result = blogs.filter((post) => post.authorId.id === authorID);
    const totalPosts = result.length;
    if (limit) result = result.slice(skip, skip + limit);
    return { posts: result, count: totalPosts };
}
