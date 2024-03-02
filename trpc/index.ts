import { TRPCError } from '@trpc/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { Auth } from '@/lib/auth';
import { db } from '@/db';
import { z } from 'zod'
import { INFINITE_QUERY_LIMIT } from '@/app/config/inifinte-query';
import { absoluteUrl } from '@/lib/utils';
import { getUserSubscriptionPlan, stripe } from '@/lib/stripe';
import { PLANS } from '@/app/config/stripe';

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
    getFileUploadStatus: privateProcedure
        .input(z.object({ fileId: z.string() }))
        .query(async ({ input, ctx }) => {
            const file = await db.file.findFirst({
                where: {
                    id: input.fileId,
                    userId: ctx.userId,
                },
            })

            if (!file) return { status: 'PENDING' as const }

            return { status: file.uploadStatus }
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
    }),
    getFile: privateProcedure.input(z.object({
        key: z.string()
    })).mutation(async ({ ctx, input }) => {
        const file = await db.file.findFirst({
            where: {
                key: input.key,
                userId: ctx.userId
            }
        })
        if (!file) throw new TRPCError({ code: 'NOT_FOUND' })
        return file
    }),
    createStripeSession: privateProcedure.mutation(async ({ ctx }) => {
        const { userId } = ctx
        const billingUrl = 'https://smart-friend-pdf.vercel.app/dashboard/billing'

        if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' })

        const dbUser = await db.user.findFirst({
            where: {
                id: userId
            }
        })
        if (!dbUser) throw new TRPCError({ code: 'UNAUTHORIZED' })

        const subscriptionPlan = await getUserSubscriptionPlan();

        if (
            subscriptionPlan.isSubscribed &&
            dbUser.stripeCustomerId
        ) {
            const stripeSession =
                await stripe.billingPortal.sessions.create({
                    customer: dbUser.stripeCustomerId,
                    return_url: billingUrl,
                })

            return { url: stripeSession.url }
        }

        const stripeSession =
            await stripe.checkout.sessions.create({
                success_url: billingUrl,
                cancel_url: billingUrl,
                payment_method_types: ['card', 'paypal'],
                mode: 'subscription',
                billing_address_collection: 'auto',
                line_items: [
                    {
                        price: PLANS.find(
                            (plan) => plan.name === 'Pro'
                        )?.price.priceIds.test,
                        quantity: 1,
                    },
                ],
                metadata: {
                    userId: userId,
                },
            })

        return { url: stripeSession.url }
    }
    ),
    getFileMessages: privateProcedure.input(z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),

    })).query(async ({ ctx, input }) => {
        const { userId } = ctx
        const { cursor, fileId } = input
        const limit = input.limit ?? INFINITE_QUERY_LIMIT

        const file = await db.file.findFirst({
            where: {
                id: fileId,
                userId
            }
        })

        if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

        const messages = await db.message.findMany({
            take: limit + 1,
            cursor: cursor ? { id: cursor } : undefined,
            where: {
                fileId
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                isUserMessage: true,
                text: true,
                createdAt: true
            }
        })
        let nextCursor: typeof cursor | undefined = undefined

        if (messages.length > limit) {
            const nextMessage = messages.pop()
            if (nextMessage) {
                nextCursor = nextMessage.id
            }
        }
        return {
            messages,
            nextCursor
        }
    })
});

export type AppRouter = typeof appRouter;