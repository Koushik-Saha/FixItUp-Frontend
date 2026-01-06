// lib/email.ts
// Email service using Resend

import { Resend } from 'resend'

// Lazy initialization to handle missing API key during build
let resendInstance: Resend | null = null

function getResend() {
    if (!resendInstance) {
        const apiKey = process.env.RESEND_API_KEY || 'dummy-key-for-build'
        resendInstance = new Resend(apiKey)
    }
    return resendInstance
}

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@maxphonerepair.com'
const COMPANY_NAME = 'Max Phone Repair'

export interface EmailOptions {
    to: string | string[]
    subject: string
    html: string
    text?: string
}

export async function sendEmail(options: EmailOptions) {
    // Skip email sending if API key is not configured (build time)
    if (!process.env.RESEND_API_KEY) {
        console.warn('Resend API key not configured - skipping email send')
        return { success: false, error: 'API key not configured' }
    }

    try {
        const resend = getResend()
        const { data, error } = await resend.emails.send({
            from: `${COMPANY_NAME} <${FROM_EMAIL}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text
        })

        if (error) {
            console.error('Email send error:', error)
            return { success: false, error }
        }

        console.log('Email sent successfully:', data)
        return { success: true, data }
    } catch (error) {
        console.error('Email service error:', error)
        return { success: false, error }
    }
}

// Order confirmation email
export async function sendOrderConfirmationEmail(order: any) {
    const subject = `Order Confirmation #${order.order_number}`

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
                .content { background: #f9fafb; padding: 20px; margin: 20px 0; }
                .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
                .item { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
                .total { font-size: 18px; font-weight: bold; padding: 15px 0; }
                .button { background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
                .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Thank You for Your Order!</h1>
                </div>

                <div class="content">
                    <p>Hi ${order.customer_name},</p>
                    <p>We've received your order and are processing it now. Here are your order details:</p>

                    <div class="order-details">
                        <h2>Order #${order.order_number}</h2>
                        <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> ${order.status}</p>

                        <h3>Items:</h3>
                        ${order.items?.map((item: any) => `
                            <div class="item">
                                <strong>${item.product_name}</strong><br>
                                Quantity: ${item.quantity} × $${item.unit_price.toFixed(2)} = $${item.subtotal.toFixed(2)}
                            </div>
                        `).join('') || '<p>No items</p>'}

                        <div class="total">
                            <p>Subtotal: $${order.subtotal.toFixed(2)}</p>
                            ${order.discount_amount > 0 ? `<p>Discount: -$${order.discount_amount.toFixed(2)}</p>` : ''}
                            <p>Tax: $${order.tax_amount.toFixed(2)}</p>
                            <p>Shipping: $${order.shipping_cost.toFixed(2)}</p>
                            <p style="color: #2563eb;">Total: $${order.total_amount.toFixed(2)}</p>
                        </div>

                        <h3>Shipping Address:</h3>
                        <p>
                            ${order.shipping_address.full_name}<br>
                            ${order.shipping_address.address_line1}<br>
                            ${order.shipping_address.address_line2 ? order.shipping_address.address_line2 + '<br>' : ''}
                            ${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.zip_code}
                        </p>
                    </div>

                    <center>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}" class="button">Track Your Order</a>
                    </center>
                </div>

                <div class="footer">
                    <p>Questions? Contact us at ${process.env.EMAIL_SUPPORT || 'support@maxphonerepair.com'}</p>
                    <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `

    return sendEmail({
        to: order.customer_email,
        subject,
        html
    })
}

// Order status update email
export async function sendOrderStatusUpdateEmail(order: any, newStatus: string) {
    const statusMessages = {
        processing: 'Your order is being prepared',
        shipped: 'Your order has been shipped',
        delivered: 'Your order has been delivered',
        cancelled: 'Your order has been cancelled',
        refunded: 'Your order has been refunded'
    }

    const subject = `Order #${order.order_number} - ${statusMessages[newStatus as keyof typeof statusMessages] || 'Status Update'}`

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
                .content { background: #f9fafb; padding: 20px; margin: 20px 0; }
                .status-box { background: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
                .button { background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
                .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Order Status Update</h1>
                </div>

                <div class="content">
                    <p>Hi ${order.customer_name},</p>

                    <div class="status-box">
                        <h2>${statusMessages[newStatus as keyof typeof statusMessages]}</h2>
                        <p>Order #${order.order_number}</p>
                        ${order.tracking_number ? `<p><strong>Tracking Number:</strong> ${order.tracking_number}</p>` : ''}
                        ${order.carrier ? `<p><strong>Carrier:</strong> ${order.carrier}</p>` : ''}
                    </div>

                    ${newStatus === 'shipped' ? `
                        <p>Your order is on its way! You can track your package using the tracking number above.</p>
                    ` : ''}

                    ${newStatus === 'delivered' ? `
                        <p>Your order has been delivered. We hope you enjoy your purchase!</p>
                    ` : ''}

                    <center>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}" class="button">View Order Details</a>
                    </center>
                </div>

                <div class="footer">
                    <p>Questions? Contact us at ${process.env.EMAIL_SUPPORT || 'support@maxphonerepair.com'}</p>
                    <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `

    return sendEmail({
        to: order.customer_email,
        subject,
        html
    })
}

// Password reset email
export async function sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`
    const subject = 'Reset Your Password'

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
                .content { background: #f9fafb; padding: 20px; margin: 20px 0; }
                .button { background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
                .warning { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
                .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>

                <div class="content">
                    <p>Hi,</p>
                    <p>We received a request to reset your password for your ${COMPANY_NAME} account.</p>

                    <center>
                        <a href="${resetUrl}" class="button">Reset Your Password</a>
                    </center>

                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>

                    <div class="warning">
                        <strong>⚠️ Security Notice:</strong><br>
                        This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.
                    </div>
                </div>

                <div class="footer">
                    <p>Questions? Contact us at ${process.env.EMAIL_SUPPORT || 'support@maxphonerepair.com'}</p>
                    <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `

    return sendEmail({
        to: email,
        subject,
        html
    })
}

// Wholesale application confirmation
export async function sendWholesaleApplicationEmail(application: any) {
    const subject = 'Wholesale Application Received'

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
                .content { background: #f9fafb; padding: 20px; margin: 20px 0; }
                .info-box { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
                .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Wholesale Application Received</h1>
                </div>

                <div class="content">
                    <p>Hi ${application.business_name},</p>
                    <p>Thank you for applying for a wholesale account with ${COMPANY_NAME}!</p>

                    <div class="info-box">
                        <h3>What's Next?</h3>
                        <p>Our team will review your application within 2-3 business days. You'll receive an email notification once your application has been processed.</p>

                        <p><strong>Application Details:</strong></p>
                        <ul>
                            <li>Business Name: ${application.business_name}</li>
                            <li>Business Type: ${application.business_type}</li>
                            <li>Requested Tier: ${application.requested_tier || 'Standard'}</li>
                            <li>Status: Pending Review</li>
                        </ul>
                    </div>

                    <p>If you have any questions, please don't hesitate to reach out to our wholesale team.</p>
                </div>

                <div class="footer">
                    <p>Questions? Contact us at ${process.env.EMAIL_WHOLESALE || 'wholesale@maxphonerepair.com'}</p>
                    <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `

    return sendEmail({
        to: application.business_email,
        subject,
        html
    })
}

// Wholesale application approval
export async function sendWholesaleApprovalEmail(application: any, credentials?: { username: string; temporaryPassword: string }) {
    const subject = 'Wholesale Application Approved!'

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #10b981; color: white; padding: 20px; text-align: center; }
                .content { background: #f9fafb; padding: 20px; margin: 20px 0; }
                .success-box { background: #d1fae5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
                .credentials { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; border: 2px solid #10b981; }
                .button { background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
                .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Application Approved!</h1>
                </div>

                <div class="content">
                    <p>Congratulations ${application.business_name}!</p>

                    <div class="success-box">
                        <h2>Your wholesale account has been approved!</h2>
                        <p><strong>Approved Tier:</strong> ${application.approved_tier || 'Tier 1'}</p>
                    </div>

                    ${credentials ? `
                        <div class="credentials">
                            <h3>Your Wholesale Account Details:</h3>
                            <p><strong>Username:</strong> ${credentials.username}</p>
                            <p><strong>Temporary Password:</strong> ${credentials.temporaryPassword}</p>
                            <p style="color: #dc2626; font-size: 14px;">⚠️ Please change your password after first login</p>
                        </div>
                    ` : ''}

                    <h3>Benefits of Your Wholesale Account:</h3>
                    <ul>
                        <li>Exclusive wholesale pricing on all products</li>
                        <li>Priority customer support</li>
                        <li>Bulk order discounts</li>
                        <li>Early access to new products</li>
                    </ul>

                    <center>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/wholesale" class="button">Start Shopping</a>
                    </center>
                </div>

                <div class="footer">
                    <p>Questions? Contact us at ${process.env.EMAIL_WHOLESALE || 'wholesale@maxphonerepair.com'}</p>
                    <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `

    return sendEmail({
        to: application.business_email,
        subject,
        html
    })
}

// Wholesale application rejection
export async function sendWholesaleRejectionEmail(application: any, reason: string) {
    const subject = 'Wholesale Application Update'

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #6b7280; color: white; padding: 20px; text-align: center; }
                .content { background: #f9fafb; padding: 20px; margin: 20px 0; }
                .reason-box { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #ef4444; }
                .button { background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
                .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Wholesale Application Update</h1>
                </div>

                <div class="content">
                    <p>Hi ${application.business_name},</p>
                    <p>Thank you for your interest in becoming a wholesale partner with ${COMPANY_NAME}.</p>

                    <div class="reason-box">
                        <p>After careful review, we are unable to approve your wholesale application at this time.</p>
                        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
                    </div>

                    <p>You are welcome to reapply in the future. If you have any questions about this decision, please contact our wholesale team.</p>

                    <center>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact-us" class="button">Contact Us</a>
                    </center>
                </div>

                <div class="footer">
                    <p>Questions? Contact us at ${process.env.EMAIL_WHOLESALE || 'wholesale@maxphonerepair.com'}</p>
                    <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `

    return sendEmail({
        to: application.business_email,
        subject,
        html
    })
}

// Repair ticket confirmation
export async function sendRepairConfirmationEmail(ticket: any) {
    const subject = `Repair Ticket #${ticket.ticket_number} - Confirmed`

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
                .content { background: #f9fafb; padding: 20px; margin: 20px 0; }
                .ticket-box { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
                .button { background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
                .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Repair Ticket Confirmed</h1>
                </div>

                <div class="content">
                    <p>Hi ${ticket.customer_name},</p>
                    <p>Your repair request has been confirmed. Here are the details:</p>

                    <div class="ticket-box">
                        <h2>Ticket #${ticket.ticket_number}</h2>
                        <p><strong>Device:</strong> ${ticket.device_brand} ${ticket.device_model}</p>
                        <p><strong>Issue:</strong> ${ticket.issue_description}</p>
                        <p><strong>Status:</strong> ${ticket.status}</p>
                        ${ticket.appointment_date ? `<p><strong>Appointment:</strong> ${new Date(ticket.appointment_date).toLocaleString()}</p>` : ''}
                        ${ticket.estimated_cost ? `<p><strong>Estimated Cost:</strong> $${ticket.estimated_cost.toFixed(2)}</p>` : ''}
                    </div>

                    <p>We'll send you updates as your repair progresses.</p>

                    <center>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/repairs/${ticket.id}" class="button">Track Repair Status</a>
                    </center>
                </div>

                <div class="footer">
                    <p>Questions? Contact us at ${process.env.EMAIL_SUPPORT || 'support@maxphonerepair.com'}</p>
                    <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `

    return sendEmail({
        to: ticket.customer_email,
        subject,
        html
    })
}

// Repair status update email
export async function sendRepairStatusUpdateEmail(ticket: any, newStatus: string) {
    const statusMessages = {
        confirmed: 'Your repair has been confirmed',
        in_progress: 'Your repair is in progress',
        waiting_parts: 'Waiting for parts',
        completed: 'Your repair is complete',
        cancelled: 'Your repair has been cancelled',
        customer_pickup: 'Your device is ready for pickup'
    }

    const subject = `Repair #${ticket.ticket_number} - ${statusMessages[newStatus as keyof typeof statusMessages] || 'Status Update'}`

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
                .content { background: #f9fafb; padding: 20px; margin: 20px 0; }
                .status-box { background: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
                .button { background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
                .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Repair Status Update</h1>
                </div>

                <div class="content">
                    <p>Hi ${ticket.customer_name},</p>

                    <div class="status-box">
                        <h2>${statusMessages[newStatus as keyof typeof statusMessages]}</h2>
                        <p>Ticket #${ticket.ticket_number}</p>
                        <p>${ticket.device_brand} ${ticket.device_model}</p>
                    </div>

                    ${newStatus === 'completed' || newStatus === 'customer_pickup' ? `
                        <p><strong>Final Cost:</strong> $${ticket.actual_cost?.toFixed(2) || ticket.estimated_cost?.toFixed(2)}</p>
                        <p>Your device is ready for pickup! Please bring your ticket number when you come.</p>
                    ` : ''}

                    ${ticket.technician_notes ? `
                        <p><strong>Technician Notes:</strong><br>${ticket.technician_notes}</p>
                    ` : ''}

                    <center>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/repairs/${ticket.id}" class="button">View Repair Details</a>
                    </center>
                </div>

                <div class="footer">
                    <p>Questions? Contact us at ${process.env.EMAIL_SUPPORT || 'support@maxphonerepair.com'}</p>
                    <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `

    return sendEmail({
        to: ticket.customer_email,
        subject,
        html
    })
}

// Payment success email
export async function sendPaymentSuccessEmail(order: any) {
    return sendOrderConfirmationEmail(order)
}

// Payment failed email
export async function sendPaymentFailedEmail(order: any) {
    const subject = `Payment Failed - Order #${order.order_number}`

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
                .content { background: #f9fafb; padding: 20px; margin: 20px 0; }
                .warning-box { background: #fee2e2; padding: 20px; border-left: 4px solid #ef4444; margin: 20px 0; }
                .button { background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
                .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Payment Failed</h1>
                </div>

                <div class="content">
                    <p>Hi ${order.customer_name},</p>

                    <div class="warning-box">
                        <h2>⚠️ Payment Processing Failed</h2>
                        <p>We were unable to process your payment for order #${order.order_number}.</p>
                        <p><strong>Total Amount:</strong> $${order.total_amount.toFixed(2)}</p>
                    </div>

                    <h3>What to do next:</h3>
                    <ul>
                        <li>Check your payment method details</li>
                        <li>Ensure you have sufficient funds</li>
                        <li>Try a different payment method</li>
                        <li>Contact your bank if the issue persists</li>
                    </ul>

                    <p>Your order is still reserved. You can complete the payment to proceed with your order.</p>

                    <center>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}/payment" class="button">Retry Payment</a>
                    </center>
                </div>

                <div class="footer">
                    <p>Questions? Contact us at ${process.env.EMAIL_SUPPORT || 'support@maxphonerepair.com'}</p>
                    <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `

    return sendEmail({
        to: order.customer_email,
        subject,
        html
    })
}

// Refund confirmation email
export async function sendRefundConfirmationEmail(order: any, refundAmount: number) {
    const subject = `Refund Processed - Order #${order.order_number}`

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #10b981; color: white; padding: 20px; text-align: center; }
                .content { background: #f9fafb; padding: 20px; margin: 20px 0; }
                .refund-box { background: #d1fae5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
                .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Refund Processed</h1>
                </div>

                <div class="content">
                    <p>Hi ${order.customer_name},</p>

                    <div class="refund-box">
                        <h2>✅ Your refund has been processed</h2>
                        <p>Order #${order.order_number}</p>
                        <p style="font-size: 24px; font-weight: bold; color: #10b981;">$${refundAmount.toFixed(2)}</p>
                    </div>

                    <p>The refund will be credited back to your original payment method within 5-10 business days.</p>

                    <p>If you have any questions about this refund, please don't hesitate to contact us.</p>
                </div>

                <div class="footer">
                    <p>Questions? Contact us at ${process.env.EMAIL_SUPPORT || 'support@maxphonerepair.com'}</p>
                    <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `

    return sendEmail({
        to: order.customer_email,
        subject,
        html
    })
}
