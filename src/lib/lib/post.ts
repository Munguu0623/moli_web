import { Prisma } from "@prisma/client";
import prisma from ".";

export async function getPost(arg: Prisma.SdaFindManyArgs) {
    try {
        const result = await prisma.sda.findMany(arg);
        return { post: result };
    } catch (error) {
        return error;
    }
}
