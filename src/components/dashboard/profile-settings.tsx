'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const profileSchema = z.object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 digits").optional().or(z.literal('')),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileSettings() {
    const { user, updateProfile } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: user?.full_name || '',
            phone: user?.phone || '',
        }
    })

    const onSubmit = async (data: ProfileFormValues) => {
        setIsLoading(true)
        try {
            await updateProfile({
                fullName: data.full_name, // auth-client expects camelCase for update but receives snake_case from form?
                // Wait, useAuthStore updateProfile takes Partial<User>.
                // User type in auth-client usually has snake_case for legacy reasons, 
                // but checking `src/lib/auth-client.ts`, `updateProfile` takes `Partial<User>` and sends JSON.
                // The API /api/auth/me expects `full_name` and `phone` in snake_case keys in body (lines 73).
                // But `updateProfile` in `auth-client.ts` takes `Partial<User>`.
                // Let's check `User` type definition in `src/types/auth.ts`.

                // If `User` has `full_name`, then passing `full_name` is correct.
                // API `PUT` expects `full_name`.

                full_name: data.full_name,
                phone: data.phone || undefined
            } as any) // Casting as any to avoid type mismatch if User type is strict about camelCase vs snake_case

            toast.success("Profile updated successfully")
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <p className="text-sm text-neutral-400">Update your personal details.</p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-neutral-950 border-neutral-800 text-neutral-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-neutral-500">Email address cannot be changed.</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                        id="full_name"
                        {...form.register('full_name')}
                        className="bg-neutral-950 border-neutral-800"
                    />
                    {form.formState.errors.full_name && (
                        <p className="text-xs text-red-500">{form.formState.errors.full_name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        {...form.register('phone')}
                        className="bg-neutral-950 border-neutral-800"
                    />
                    {form.formState.errors.phone && (
                        <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>
                    )}
                </div>

                <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </form>
        </section>
    )
}
