import { db } from '@/db'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import type Stripe from 'stripe'

export async function POST(request: Request) {
    try {
        const body = await request.text()
        const signature = headers().get('Stripe-Signature') || ''

        // Verify webhook signature
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ''
        )
        // Process Stripe event
        await processStripeEvent(event)

        return new Response(null, { status: 200 })
    } catch (error) {
        console.error('Webhook processing error:', error)
        return new Response('Webhook processing error', { status: 500 })
    }
}

async function processStripeEvent(event: Stripe.Event) {
    const session = event.data.object as Stripe.Checkout.Session

    if (!session?.metadata?.userId) {
        console.error('Missing userId in session metadata')
        return
    }

    switch (event.type) {
        case 'checkout.session.completed':
            await handleCheckoutCompleted(session)
            break
        case 'invoice.payment_succeeded':
            await handleInvoicePaymentSucceeded(session)
            break
        default:
            console.log(`Unhandled event type: ${event.type}`)
    }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const subscriptionId = session.subscription as string
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    await db.user.update({
        where: { id: session?.metadata?.userId },
        data: {
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
    })
}

async function handleInvoicePaymentSucceeded(session: Stripe.Checkout.Session) {
    const subscriptionId = session.subscription as string
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    await db.user.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
    })
}