
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse } from '@/lib/utils/errors'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = body

        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Email is required' },
                { status: 400 }
            )
        }

        // Check if already subscribed
        const existing = await prisma.subscriber.findUnique({
            where: { email }
        })

        if (existing) {
            if (existing.isSubscribed) {
                return NextResponse.json({
                    success: true,
                    message: "You're already subscribed!"
                })
            } else {
                // Re-subscribe
                await prisma.subscriber.update({
                    where: { id: existing.id },
                    data: {
                        isSubscribed: true,
                        unsubscribedAt: null
                    }
                })
                return NextResponse.json({
                    success: true,
                    message: 'Welcome back! You have been re-subscribed.'
                })
            }
        }

        // Create new subscriber
        await prisma.subscriber.create({
            data: { email }
        })

        return NextResponse.json({
            success: true,
            message: 'Thank you for subscribing!'
        })

    } catch (error) {
        return errorResponse(error)
    }
}
