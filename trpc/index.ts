import { TRPCError } from '@trpc/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { Auth } from '@/lib/auth';
import { db } from '@/db';
import { z } from 'zod'
export const appRouter = router({
    authCallback: publicProcedure.query(async () => {
        const user = await Auth();

        if (!user?.id || !user.emailAddresses[0].emailAddress)
            throw new TRPCError({ code: 'UNAUTHORIZED' })

        // check if the user is in the database
        const dbUser = await db.user.findFirst({
            where: {
                id: user.id,
            }
        })
        if (!dbUser) {
            await db.user.create({
                data: {
                    id: user.id,
                    email: user.emailAddresses[0].emailAddress
                }
            })
        }

        return { success: true }
    }),
    getUserFile: privateProcedure.query(async ({ ctx }) => {
        return db.file.findMany({
            where: {
                userId: ctx.userId
            }
        })
    }),
    deleteFile: privateProcedure.input(z.object({
        id: z.string()
    })).mutation(async ({ ctx, input }) => {
        const file = await db.file.findFirst({
            where: {
                id: input.id,
                userId: ctx.userId
            }
        })
        if (!file) throw new TRPCError({ code: 'NOT_FOUND' })
        await db.file.delete({
            where: {
                id: input.id
            }
        })
    })
});

export type AppRouter = typeof appRouter;