"use client"
import { FC } from 'react'
import { trpc } from '@/app/_trpc/client'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { Loader2 } from 'lucide-react'

const AuthCallBackPage: FC = () => {

    const router = useRouter()
    const searchParams = useSearchParams()
    const origin = searchParams.get('origin')
    const { status, error } = trpc.authCallback.useQuery(undefined, {
        retry: true,
        retryDelay: 500
    })
    if (status === "success") router.push(origin ? `/${origin}` : '/dashboard')
    if (error?.data?.code === "UNAUTHORIZED") router.push(process.env.CLERK_SIGN_IN_URL!)

    return (
        <div className='w-full mt-24 flex justify-center'>
            <div className='flex flex-col items-center gap-2'>
                <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
                <h3 className='font-semibold text-xl'>
                    Setting up your account...
                </h3>
                <p>You will be redirected automatically.</p>
            </div>
        </div>
    )
}
export default AuthCallBackPage
