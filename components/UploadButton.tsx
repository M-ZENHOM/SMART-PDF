"use client"
import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import DropZone from 'react-dropzone'
import { Cloud, File, Loader2 } from 'lucide-react'
import { Progress } from './ui/progress'
import { useUploadThing } from '@/lib/uploadthing'
import { toast } from "sonner"
import { trpc } from '@/app/_trpc/client'
import { useRouter } from 'next/navigation'


const UploadButton = ({ isSubscribed }: { isSubscribed: boolean }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
        <Dialog
            open={isOpen}
            onOpenChange={(v: boolean) => {
                if (!v) {
                    setIsOpen(v)
                }
            }}>
            <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                <Button>Upload files</Button>
            </DialogTrigger>

            <DialogContent>
                <UploadDragZone isSubscribed={isSubscribed} />
            </DialogContent>

        </Dialog>
    )
}


const UploadDragZone = ({ isSubscribed }: { isSubscribed: boolean }) => {
    const router = useRouter()
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    const { startUpload } = useUploadThing(
        isSubscribed ? 'proPlanUploader' : 'freePlanUploader',
    )

    const { mutate: startPolling } = trpc.getFile.useMutation({
        onSuccess: (file) => {
            router.push(`/dashboard/${file.id}`)
        },
        retry: true,
        retryDelay: 500
    })

    // for better ux 🤍
    const startSimulatedProgress = () => {
        setUploadProgress(0)

        const interval = setInterval(() => {
            setUploadProgress((prevProgress) => {
                if (prevProgress >= 95) {
                    clearInterval(interval)
                    return prevProgress
                }
                return prevProgress + 5
            })
        }, 500)

        return interval
    }
    return (
        <DropZone multiple={false} onDrop={async (acceptedFile) => {
            setIsUploading(true)
            const progressInterval = startSimulatedProgress()

            const res = await startUpload(acceptedFile)
            if (!res) {
                return toast.error("Something went wrong")
            }

            const [filleResponse] = res

            const key = filleResponse?.key

            if (!key) {
                return toast.error("Something went wrong")
            }
            clearInterval(progressInterval)
            setUploadProgress(100)
            startPolling({ key })
        }}>
            {({ getRootProps, getInputProps, acceptedFiles }) => (
                <div {...getRootProps()} className='h-64 border border-dashed rounded-lg m-4 bg-zinc-50 hover:bg-zinc-100 flex flex-col justify-center items-center '>
                    <label htmlFor='dropzone-file' className='w-full h-full flex flex-col justify-center items-center cursor-pointer space-y-3'>
                        <Cloud className='w-7 h-7 text-zinc-500' />
                        <p>Drag and drop files here,{" "}
                            <span className='font-semibold'>or click to select files</span>
                        </p>
                        <p className='text-xs text-zinc-500'>PDF (up to {isSubscribed ? '16' : '4'}MB)</p>
                        {acceptedFiles && acceptedFiles[0] ? (
                            <div className='max-w-xs bg-white flex  items-center rounded-lg overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200'>
                                <div className='px-3 py-2 h-full'>
                                    <File className='w-5 h-5 text-blue-500' />
                                </div>
                                <p className='px-6 py-2 text-sm truncate'>{acceptedFiles[0].name}</p>
                            </div>
                        ) : null}

                        {isUploading ? (
                            <div className='w-full max-w-xs mx-auto'>
                                <Progress indicatorColor={uploadProgress === 100 ? 'bg-green-500' : ''} value={uploadProgress} className='h-1 bg-zinc-200 w-full' />
                                {uploadProgress === 100 ? (
                                    <div className='flex items-center justify-center gap-4 mt-4 text-zinc-500'>
                                        <Loader2 className='animate-spin h-4 w-4' />
                                        <p className='text-sm'>Redirecting...</p>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}

                        <input {...getInputProps()} type='file' id='dropzone-file' className='hidden' />
                    </label>
                </div>
            )}

        </DropZone>

    )
}

export default UploadButton