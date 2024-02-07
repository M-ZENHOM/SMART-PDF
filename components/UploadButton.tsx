"use client"
import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'

const UploadButton = () => {
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
                files content
            </DialogContent>

        </Dialog>
    )
}

export default UploadButton