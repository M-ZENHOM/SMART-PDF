import ChatWrapper from '@/components/chat/ChatWrapper'
import PdfRenderer from '@/components/PdfRenderer'
import { db } from '@/db'
import { Auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

async function page({ params }: { params: { fileid: string } }) {

    const user = await Auth()
    const { fileid } = params

    if (!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileid}`)

    const file = await db.file.findFirst({
        where: {
            id: fileid,
            userId: user.id
        }
    })
    if (!file) notFound()

    return (
        <div className='flex-1 justify-between flex-col h-[clac(100vh-3.5rem)]'>
            <div className='mx-auto w-full max-w-8xl gorw lg:flex xl:px-2'>
                {/* pdf */}
                <div className='flex-1 xl:flex'>
                    <div className='px-4 py-6 sm:px-6 lg:pl-6 xl:flex-1 xl:pl-6'>
                        <PdfRenderer url={file.url} />
                    </div>
                </div>
                {/* chat */}
                <div className='shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0 px-4'>
                    <ChatWrapper fileId={file.id} />
                </div>
            </div>
        </div>
    )
}

export default page