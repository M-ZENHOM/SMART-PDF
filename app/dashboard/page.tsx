import Dashboard from '@/components/Dashboard';
import { db } from '@/db';
import { Auth } from '@/lib/auth';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function page() {
    const user = await Auth();
    if (!user || !user.id) redirect('/auth-callback?origin=dashboard')

    const dbUser = await db.user.findFirst({
        where: {
            id: user.id
        }
    })

    if (!dbUser) redirect('/auth-callback?origin=dashboard')

    const subscriptionPlan = await getUserSubscriptionPlan()
    return <Dashboard subscriptionPlan={subscriptionPlan} />
}
