
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
        select: {
            id: true
        },
        orderBy: {
            createdDate: "desc",
        },
        skip,
        take: limit,
    })
    console.log('blogs with user---->', blog)

    const blogtest = await Promise.all(
        blog.map((blog) => getBlogById(blog.id))
    );
    let blogs = JSON.parse(JSON.stringify(blogtest))
    return { blogs, count: blogs.length };
}

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


export async function getBlogByCategory(
    value: string
) {
    let blogs = await prisma.blogs.findMany({
        select: {
            id: true, Category: true
        },
        where: {

            Category: {
                name: value
            }

        },
    });
    let blogtest: IBlog[]
    blogtest = await Promise.all(
        blogs.map((blog) => getBlogById(blog.id))
    );
    const blog = JSON.parse(JSON.stringify(blogtest))
    return { blogs: blog, count: blogtest.length };
}



export async function searchBlogs(
    value: string
) {
    let blogs = await prisma.blogs.findMany({
        select: {
            id: true, Category: true
        },
        where: {
            OR: [{
                content: {
                    contains: value
                },
            },
            {
                title: {
                    contains: value
                }
            }, {
                Category: {
                    name: {
                        contains: value
                    }
                }
            }]
        },
    });
    let blogtest: IBlog[]
    blogtest = await Promise.all(
        blogs.map((blog) => getBlogById(blog.id))
    );
    const blog = JSON.parse(JSON.stringify(blogtest))
    return { blogs: blog };
}
export async function getAllCategories() {
    let category = await prisma.category.findMany();
    console.log(category, "category---");
    return { category };
}
