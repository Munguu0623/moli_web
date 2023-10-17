
import { IBlog, IDType } from "@utils/types";

import { Prisma, PrismaClient } from "@prisma/client";

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

export async function getBlogById(id: number): Promise<IBlog> {
    const blogData = await prisma.blogs.findUnique({
        where: { id } as BlogsWhereUniqueInput,
        include: {
            Category: true,
            Users: true,
        },
    });

    if (!blogData) {
        throw new Error(`Blog post with id ${id} not found.`);
    }

    const category = blogData.Category;
    const user = blogData.Users;

    return {
        ...blogData,
        createdDate: blogData.createdDate?.toString(),
        modifiedDate: blogData.modifiedDate?.toString(),
        category: {
            id: category?.id,
            name: category?.name,
            path: category ? `/blogs/category/${category.name}` : '/',
        },
        author: {
            id: blogData.authorId,
            firstName: user?.firstName,
            password: user?.password,
            phoneNumber: user?.phoneNumber,
            email: user?.email,
            createdDate: user?.createdDate?.toString(),
            modifiedDate: user?.modifiedDate?.toString(),
        },
        views: 2,
        excerpt: makeExcerpt(blogData?.content, 150),
        path: `/blogs/${blogData.id}?name=${blogData.slug}`,
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
    const totalCount = await prisma.blogs.count();
    const blogtest = await Promise.all(
        blog.map((blog) => getBlogById(blog.id))
    );
    let blogs = JSON.parse(JSON.stringify(blogtest))
    return { blogs, count: totalCount };
}

export async function getPostsByAuthor(
    authorID: IDType,
    skip = 0,
    limit?: number
) {
    let blogs = await prisma.blogs.findMany({
        where: {
            authorId: authorID
        }
    });

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

    return { category };
}
export async function getPrevNextPost(slug: string) {
    const { blogs } = await getAllBlogs();
    const currentIndex = blogs.findIndex((blog: IBlog) => blog.slug === slug);
    const prevPost = blogs[currentIndex - 1] || null;
    const nextPost = blogs[currentIndex + 1] || null;
    return { prevPost, nextPost };
}