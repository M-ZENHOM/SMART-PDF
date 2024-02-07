"use client"
import React, { useState } from 'react'
import UploadButton from './UploadButton'
import { trpc } from '@/app/_trpc/client'
import { Ghost, Loader2, MessageSquare, Plus, Trash } from 'lucide-react'
import { Skeleton } from './ui/skeleton'
import Link from 'next/link'
import { formatTime } from '@/lib/utils'
import { Button } from './ui/button'

const Dashboard = () => {
    const [isDeletingFile, setIsDeletingFile] = useState<string | null>(null)
    const uilts = trpc.useUtils()
    const { data: files, isLoading } = trpc.getUserFile.useQuery()
    const { mutate: deleteFile } = trpc.deleteFile.useMutation({
        onSuccess: () => {
            uilts.getUserFile.invalidate()
        },
        onMutate: ({ id }) => {
            setIsDeletingFile(id)
        },
        onSettled() {
            setIsDeletingFile(null)
        }
    })

    return (
        <main className='w-full max-w-7xl mx-auto flex flex-col gap-4 '>
            <div className='w-full flex justify-between items-center border-b border-gray-200 p-10'>
                <h2 className='text-3xl font-bold'>My Files</h2>
                <UploadButton />
            </div>

            {files && files.length > 0 ? (
                <ul className='grid grid-cols-1 place-items-center sm:grid-cols-2 md:grid-cols-3 gap-4'>
                    {files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(file => (
                        <li key={file.id} className='w-full max-w-md col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg '>
                            <Link href={`/dashboard/${file.id}`} className='flex flex-col gap-2 p-4 '>
                                <div className='w-full flex items-center gap-5 truncate py-4'>
                                    <div className='w-10 h-10 bg-gradient-to-l from-violet-500 to-cyan-500 rounded-full' />
                                    <h2 className='font-semibold text-xl'>{file.name}</h2>
                                </div>
                            </Link>
                            <div className='grid grid-cols-3 place-items-center text-zinc-500 gap-6 py-2 px-5'>
                                <div className='w-full flex items-center gap-2'>
                                    <Plus className='h-4 w-4 ' />
                                    {formatTime(file.createdAt)}
                                </div>
                                <div className='flex items-center gap-2'>
                                    <MessageSquare className='h-4 w-4 ' />
                                    mocked
                                </div>
                                <Button onClick={() => deleteFile({ id: file.id })} className='w-full' size='sm' variant='destructive'>
                                    {isDeletingFile === file.id ? <Loader2 className='h-4 w-4 animate-spin ' /> : <Trash className='h-4 w-4 ' />}
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : isLoading ?
                (
                    <div className='mt-16 flex flex-col items-center gap-2 '>
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex items-center justify-center flex-col">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                ) : (
                    <div className='mt-16 flex flex-col items-center gap-2'>
                        <Ghost className='h-8 w-8 text-zinc-800' />
                        <h3 className='font-semibold text-xl'>Pretty empty around here</h3>
                        <p>Let&apos;s upload your frist PDF.</p>
                    </div>
                )}
        </main>
    )
}

export default Dashboard