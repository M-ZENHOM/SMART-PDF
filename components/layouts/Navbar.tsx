import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Icons } from '../Icons'
import { buttonVariants } from '../ui/button'
import MaxWidthWrapper from '../MaxWidthWrapper'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { Auth } from '@/lib/auth'
import UserAccountNav from '../UserAccountNav'
import { getUserSubscriptionPlan } from '@/lib/stripe'

export default async function Navbar() {
    const user = await Auth();
    const Supscription = await getUserSubscriptionPlan()
    return (
        <nav className='w-full bg-white border-b sticky h-14 inset-x-0 top-0 border-gray-200 bg-white/75 backdrop-blur-lg transition-all z-30 '>
            <MaxWidthWrapper className='h-14 flex items-center justify-between'>
                <Link href='/'>Smart PDF</Link>
                <div className='flex items-center space-x-4'>

                    {!user ?
                        (
                            <>
                                <Link href='/pricing'>Pricing</Link>
                                <SignInButton>Sign in</SignInButton>
                                <SignUpButton>
                                    <button className={cn(buttonVariants({ size: "sm" }), "bg-orange-400")}>Get Started <Icons.RightArrow className='w-4 h-4 ml-2' /></button>
                                </SignUpButton>
                            </>
                        )
                        : (
                            <>
                                <Link
                                    href='/dashboard'
                                    className={buttonVariants({
                                        variant: 'ghost',
                                        size: 'sm',
                                    })}>
                                    Dashboard
                                </Link>
                                <UserAccountNav
                                    Supscription={Supscription}
                                    name={user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Your Account'}
                                    email={user.emailAddresses[0].emailAddress ?? ''}
                                    imgUrl={user.imageUrl ?? ''} />
                            </>
                        )}
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}
