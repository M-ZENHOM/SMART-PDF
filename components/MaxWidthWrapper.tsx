import { cn } from '@/lib/utils'
import React from 'react'

export default function MaxWidthWrapper({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn('w-full mx-auto max-w-screen-xl px-3 md:px-16', className)}>{children}</div>
    )
}
