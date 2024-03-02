"use client"
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback } from './ui/avatar'
import Image from 'next/image'
import Link from 'next/link'
import { Gem, Settings } from 'lucide-react'
import { SignOutButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { buttonVariants } from './ui/button'
import type { getUserSubscriptionPlan } from '@/lib/stripe'
import { usePathname, useRouter } from 'next/navigation'

interface UserAccount {
    email: string
    name: string
    imgUrl: string
    Supscription: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

function UserAccountNav({ email, name, imgUrl, Supscription }: UserAccount) {
    const router = useRouter();
    const [isOpen, setIsOpen] = React.useState(false)
    const pathName = usePathname()
    const closeOnNav = (href: string) => {
        pathName !== href && setIsOpen(false)
    }
    return (
        <DropdownMenu open={isOpen} onOpenChange={(v) => {
            if (!v) {
                setIsOpen(v)
            }
        }}>
            <DropdownMenuTrigger asChild onClick={() => setIsOpen(true)}>
                {imgUrl ?
                    <Avatar className="w-8 h-8 cursor-pointer" >
                        <div className='w-full h-full relative aspect-square'>
                            <Image fill src={imgUrl} alt='profile picture' referrerPolicy='no-referrer' />
                        </div>
                    </Avatar>
                    : <AvatarFallback><span className='sr-only'>{name}</span></AvatarFallback>}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{name}</DropdownMenuLabel>
                <DropdownMenuItem>{email}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => closeOnNav('/dashboard')} >
                    <Link className='w-full' href='/dashboard'>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => closeOnNav('/user-profile')} >
                    <Link className='flex items-center w-full' href="/user-profile"  >
                        Manage Account <Settings className='w-4 h-4 text-zinc-900 mx-1' />
                    </Link>
                </DropdownMenuItem>
                {Supscription?.isSubscribed ?
                    <DropdownMenuItem onClick={() => closeOnNav('/dashboard/billing')} >
                        <Link className='w-full' href='/dashboard/billing'>Manage Subscription</Link>
                    </DropdownMenuItem>
                    : <DropdownMenuItem onClick={() => closeOnNav('/pricing')}>
                        <Link className='flex items-center w-full' href="/pricing">
                            Upgrade <Gem className='w-4 h-4 text-blue-900 mx-1' />
                        </Link>
                    </DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem className={cn(buttonVariants({ variant: "default", size: "sm" }), "w-full")}>
                    <SignOutButton signOutCallback={() => router.push('/')} />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

export default UserAccountNav