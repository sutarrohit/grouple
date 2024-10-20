"use server"
import { client } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    typescript: true,
    apiVersion: "2024-06-20",
})

export const onGetStripeClientSecret = async () => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            currency: "usd",
            amount: 9900,
            automatic_payment_methods: {
                enabled: true,
            },
        })

        if (paymentIntent) {
            return { secret: paymentIntent.client_secret }
        }
    } catch (error) {
        return { status: 400, message: "Failed to load form" }
    }
}

export const onTransferCommission = async (destination: string) => {
    try {
        const transfer = await stripe.transfers.create({
            amount: 3960,
            currency: "usd",
            destination: destination,
        })

        if (transfer) {
            return { status: 200 }
        }
    } catch (error) {
        return { status: 400 }
    }
}

export const onCreateNewGroupSubscription = async (
    groupid: string,
    price: string,
) => {
    try {
        const subscription = await client.group.update({
            where: {
                id: groupid,
            },
            data: {
                subscription: {
                    create: {
                        price: parseInt(price),
                    },
                },
            },
        })

        if (subscription) {
            return { status: 200, message: "Subscription created" }
        }
    } catch (error) {
        return { status: 400, message: "Oops something went wrong" }
    }
}
