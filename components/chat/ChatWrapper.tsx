'use client'
import React from 'react'
import ChatInput from './ChatInput'
import { trpc } from '@/app/_trpc/client'
import { ChevronLeft, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { ChatContextProvider } from './ChatContext'
import Messages from './Messages'

interface ChatWrapperProps {
    fileId: string
}

function ChatWrapper({ fileId }: ChatWrapperProps) {

    const { data, isLoading } = trpc.getFileUploadStatus.useQuery({ fileId }, {
        // refetchInterval: (data) => data?.status === 'SUCCESS' || data?.status === 'FAILED' ? false : 500
    })

    if (isLoading) {
        return (
            <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
                <div className='flex flex-col items-center gap-2 my-52'>
                    <Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
                    <h3 className='font-semibold text-xl'>
                        Loading...
                    </h3>
                    <p className='text-zinc-500 text-sm'>
                        We&apos;re preparing your PDF.
                    </p>
                </div>
                <ChatInput isDisabled />
            </div>
        )
    }

    if (data?.status === "PROCESSING") {
        return (
            <div className='flex flex-col justify-center items-center gap-1  h-full w-full py-20 lg:py-0 '>
                <div className='flex flex-col items-center gap-2 my-52'>
                    <Loader2 className='h-6 w-6 animate-spin text-blue-500' />
                    <h3 className='font-semibold text-xl'>
                        Processing PDF....
                    </h3>
                    <p className='text-zinc-500 text-sm'>
                        This won&apos;t take long.
                    </p>
                </div>
                <ChatInput isDisabled />
            </div>
        )

    }

    if (data?.status === "FAILED") {
        return (
            <div className='flex flex-col justify-center items-center gap-1  h-full w-full  my-52 '>
                <XCircle className='h-8 w-8 text-red-500' />
                <h3 className='font-semibold text-xl'>
                    Too many pages in PDF
                </h3>
                <p className='text-zinc-500 text-sm'>
                    Yout plan supports up to 3 pages.
                </p>
                <Link
                    href='/dashboard'
                    className={buttonVariants({
                        variant: 'secondary',
                        className: 'mt-4',
                    })}>
                    <ChevronLeft className='h-3 w-3 mr-1.5' />
                    Back
                </Link>
            </div>

        )
    }

    return (
        <ChatContextProvider fileId={fileId}>
            <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
                <div className='flex-1 justify-between flex flex-col '>
                    <Messages fileId={fileId} />
                </div>

                <ChatInput />
            </div>
        </ChatContextProvider>
    )
}

export default ChatWrapper