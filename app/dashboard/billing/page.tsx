import React from 'react'
import BillingForm from '@/components/BillingForm'
import { getUserSubscriptionPlan } from '@/lib/stripe'

export default async function page() {
    const subscriptionPlan = await getUserSubscriptionPlan()
    return <BillingForm subscriptionPlan={subscriptionPlan} />
}
