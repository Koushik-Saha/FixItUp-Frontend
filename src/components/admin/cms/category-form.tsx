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
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

// Schema
const categorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with dashes'),
    description: z.string().optional(),
    icon: z.string().optional(),
    displayOrder: z.coerce.number().int().default(0),
    isActive: z.boolean().default(true),
})

type CategoryFormValues = z.infer<typeof categorySchema>
import { Category } from '@prisma/client'

interface CategoryFormProps {
    initialData?: Category | null
    onSubmit: (data: CategoryFormValues) => Promise<void>
    onCancel: () => void
}

export function CategoryForm({ initialData, onSubmit, onCancel }: CategoryFormProps) {
    const [loading, setLoading] = useState(false)

    const defaultValues: Partial<CategoryFormValues> = {
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        icon: initialData?.icon || '',
        displayOrder: initialData?.displayOrder || 0,
        isActive: initialData?.isActive ?? true,
    }

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues
    })

    const handleSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true)
            await onSubmit(data)
            toast.success(initialData ? 'Category updated' : 'Category created')
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    // Auto-generate slug from name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value
        form.setValue('name', name)
        if (!initialData) { // Only auto-slug on create
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            form.setValue('slug', slug)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Smartphone Parts" {...field} onChange={handleNameChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                                <Input placeholder="smartphone-parts" {...field} />
                            </FormControl>
                            <FormDescription>URL-friendly identifier</FormDescription>
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
                                <Textarea placeholder="Category description..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Icon (Emoji or URL)</FormLabel>
                            <FormControl>
                                <Input placeholder="📱" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex items-center gap-8">
                    <FormField
                        control={form.control}
                        name="displayOrder"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Display Order</FormLabel>
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
                        {initialData ? 'Update Category' : 'Create Category'}
                    </Button>
                </div>

            </form>
        </Form>
    )
}
