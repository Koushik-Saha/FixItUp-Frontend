'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

// Schema
const heroSlideSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    image: z.string().url('Must be a valid URL'),
    badge: z.string().optional(),
    badgeColor: z.string().optional(),
    gradient: z.string().optional(),
    discount: z.string().optional(),
    sortOrder: z.coerce.number().int().default(0),
    isActive: z.boolean().default(true),

    // CTAs (simplified for now, string inputs)
    ctaPrimaryText: z.string().optional(),
    ctaPrimaryLink: z.string().optional(),

    ctaSecondaryText: z.string().optional(),
    ctaSecondaryLink: z.string().optional(),
})

type HeroSlideFormValues = z.infer<typeof heroSlideSchema>
import { HeroSlide } from '@prisma/client'

import { Prisma } from '@prisma/client'

interface HeroSlideFormProps {
    initialData?: HeroSlide | null
    onSubmit: (data: Prisma.HeroSlideCreateInput | Prisma.HeroSlideUpdateInput) => Promise<void>
    onCancel: () => void
}

export function HeroSlideForm({ initialData, onSubmit, onCancel }: HeroSlideFormProps) {
    const [loading, setLoading] = useState(false)

    // Helper to safely access JSON fields
    const ctaPrimary = initialData?.ctaPrimary as { text: string; link: string } | null;
    const ctaSecondary = initialData?.ctaSecondary as { text: string; link: string } | null;

    // Parse initial CTAs if editing
    const defaultValues: Partial<HeroSlideFormValues> = {
        title: initialData?.title || '',
        description: initialData?.description || '',
        image: initialData?.image || '',
        badge: initialData?.badge || '',
        badgeColor: initialData?.badgeColor || 'bg-blue-600',
        gradient: initialData?.gradient || 'from-blue-900 to-slate-900',
        discount: initialData?.discount || '',
        sortOrder: initialData?.sortOrder || 0,
        isActive: initialData?.isActive ?? true,

        ctaPrimaryText: ctaPrimary?.text || '',
        ctaPrimaryLink: ctaPrimary?.link || '',
        ctaSecondaryText: ctaSecondary?.text || '',
        ctaSecondaryLink: ctaSecondary?.link || '',
    }

    const form = useForm<HeroSlideFormValues>({
        resolver: zodResolver(heroSlideSchema),
        defaultValues
    })

    const handleSubmit = async (data: HeroSlideFormValues) => {
        try {
            setLoading(true)

            // Transform form data back to API structure
            const apiData = {
                ...data,
                ctaPrimary: data.ctaPrimaryText ? { text: data.ctaPrimaryText, link: data.ctaPrimaryLink } : null,
                ctaSecondary: data.ctaSecondaryText ? { text: data.ctaSecondaryText, link: data.ctaSecondaryLink } : null,
            }

            await onSubmit(apiData as unknown as Prisma.HeroSlideCreateInput)
            toast.success(initialData ? 'Slide updated' : 'Slide created')
        } catch (error) {
            console.error(error)
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Big Sale!" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Short description..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormDescription>Use Unsplash or valid image link</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Styling & Badges */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="badge"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Badge Text</FormLabel>
                                        <FormControl>
                                            <Input placeholder="New" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="badgeColor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Badge Color (Tailwind)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="bg-blue-600" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="gradient"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Background Gradient</FormLabel>
                                    <FormControl>
                                        <Input placeholder="from-blue-900 to-slate-900" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="discount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount Badge (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="50% OFF" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* CTAs */}
                <div className="border p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                    <h3 className="font-semibold mb-4">Call to Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <FormLabel>Primary Button</FormLabel>
                            <FormField
                                control={form.control}
                                name="ctaPrimaryText"
                                render={({ field }) => (
                                    <Input placeholder="Button Text" {...field} className="mb-2" />
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ctaPrimaryLink"
                                render={({ field }) => (
                                    <Input placeholder="/shop" {...field} />
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormLabel>Secondary Button</FormLabel>
                            <FormField
                                control={form.control}
                                name="ctaSecondaryText"
                                render={({ field }) => (
                                    <Input placeholder="Button Text" {...field} className="mb-2" />
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ctaSecondaryLink"
                                render={({ field }) => (
                                    <Input placeholder="/contact" {...field} />
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <FormField
                        control={form.control}
                        name="sortOrder"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sort Order</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} className="w-24" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm gap-4">
                                <div className="space-y-0.5">
                                    <FormLabel>Active</FormLabel>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? 'Update Slide' : 'Create Slide'}
                    </Button>
                </div>

            </form>
        </Form>
    )
}
