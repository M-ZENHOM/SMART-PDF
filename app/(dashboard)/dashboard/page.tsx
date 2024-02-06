import { Auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function page() {
    const user = await Auth();
    if (!user || !user.id) redirect('/auth-callback?origin=dashboard')
    return (
        <div>{user?.emailAddresses[0]?.emailAddress}</div>
    )
}
