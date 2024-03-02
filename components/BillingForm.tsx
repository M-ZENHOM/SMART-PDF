"use client"
import { getUserSubscriptionPlan } from '@/lib/stripe'
import React from 'react'
import MaxWidthWrapper from './MaxWidthWrapper'
import { trpc } from '@/app/_trpc/client'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { formatTime } from '@/lib/utils'
import { toast } from 'sonner'

interface BillingFormProps {
    subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

export default function BillingForm({ subscriptionPlan }: BillingFormProps) {

    const { mutate: createStripeSession, isPending } = trpc.createStripeSession.useMutation({
        onSuccess: ({ url }) => {
            if (url) window.location.href = url
            if (!url) {
                toast.error("Something went wrong")
            }
        }
    })
    return (
        <MaxWidthWrapper>
            <form className='mt-12' onSubmit={(e) => {
                e.preventDefault()
                createStripeSession()
            }}>
                <Card>
                    <CardHeader>
                        <CardTitle>Subscription Plan</CardTitle>
                        <CardDescription>You are currently on the{' '} <strong>{subscriptionPlan?.name}</strong> plan</CardDescription>
                    </CardHeader>
                    <CardFooter className='flex flex-col items-center justify-between space-y-2 md:flex-row md:justify-between md:space-x-0'>
                        <Button type='submit'>
                            {isPending ? (
                                <Loader2 className='h-4 w-4 animate-spin mr-4' />
                            ) : null}
                            {subscriptionPlan?.isSubscribed ? 'Mange Subscription' : 'Upgrade to Pro'}
                        </Button>
                        {subscriptionPlan?.isSubscribed ? (
                            <p className='rounded-full text-xs font-medium'>
                                {subscriptionPlan?.isCanceled ? 'Your plan will  be canceled on ' : 'Your plan renews on'}
                                {formatTime(subscriptionPlan?.stripeCurrentPeriodEnd?.toLocaleString()!)}
                            </p>
                        ) : null}
                    </CardFooter>
                </Card>

            </form>

        </MaxWidthWrapper>
    )
}
