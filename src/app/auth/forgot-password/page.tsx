'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Mail } from 'lucide-react'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (response.ok) {
                toast.success(data.message || 'If an account exists, a reset link has been sent.')
                setEmail('')
            } else {
                toast.error(data.error || 'Failed to send reset email')
            }
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-unused-vars
            toast.error('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-neutral-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-6">
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Login
                    </Link>
                </div>

                <Card className="shadow-lg border-0 dark:bg-neutral-800">
                    <CardHeader className="text-center">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-neutral-900 dark:text-white">
                            Forgot Password?
                        </CardTitle>
                        <CardDescription>
                            Enter your email address and we&apos;ll send you a link to reset your password.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Alerts removed in favor of Toasts */}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11"
                                    disabled={isLoading}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Sending Reset Link...
                                    </div>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>
                        </form>

                        <div className="text-center">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Remember your password?{' '}
                                <Link
                                    href="/auth/login"
                                    className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}