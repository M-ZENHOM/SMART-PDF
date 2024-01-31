import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Icons } from '../Icons'
import { buttonVariants } from '../ui/button'
import MaxWidthWrapper from '../MaxWidthWrapper'

export default function Navbar() {
    return (
        <nav className='w-full bg-white border-b sticky h-14 inset-x-0 top-0 border-gray-200 bg-white/75 backdrop-blur-lg transition-all z-30 '>
            <MaxWidthWrapper className='h-14 flex items-center justify-between'>
                <Link href='/'>Smart PDF</Link>
                <div className='space-x-4'>
                    <Link href='/pricing'>Pricing</Link>
                    <Link href='/sign-in'>Sign In</Link>
                    <Link href='/sign-up' className={cn(buttonVariants({ size: "sm" }), "bg-orange-400")}>Smart PDF <Icons.RightArrow className='w-4 h-4 ml-2' /></Link>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}
