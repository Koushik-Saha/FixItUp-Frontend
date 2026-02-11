'use client'

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Trash2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { CategoryForm } from '@/components/admin/cms/category-form'
import { toast } from 'sonner'

import { Category, Prisma } from '@prisma/client'

type CategoryWithCount = Category & {
    _count: {
        products: number
    }
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<CategoryWithCount[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null)

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories')
            const json = await res.json()
            if (json.data) {
                setCategories(json.data)
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to load categories')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleCreate = async (data: Prisma.CategoryCreateInput) => {
        const res = await fetch('/api/admin/categories', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })

        const json = await res.json()
        if (res.ok) {
            fetchCategories()
            setIsDialogOpen(false)
        } else {
            throw new Error(json.error || 'Failed to create')
        }
    }

    const handleUpdate = async (data: Prisma.CategoryUpdateInput) => {
        if (!editingCategory) return

        const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })

        const json = await res.json()
        if (res.ok) {
            fetchCategories()
            setIsDialogOpen(false)
            setEditingCategory(null)
        } else {
            throw new Error(json.error || 'Failed to update')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return

        try {
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: 'DELETE'
            })
            const json = await res.json()
            if (res.ok) {
                toast.success('Category deleted')
                fetchCategories()
            } else {
                toast.error(json.error || 'Failed to delete')
            }
        } catch (error) {
            toast.error('Failed to delete')
        }
    }

    const openCreateDialog = () => {
        setEditingCategory(null)
        setIsDialogOpen(true)
    }

    const openEditDialog = (category: CategoryWithCount) => {
        setEditingCategory(category)
        setIsDialogOpen(true)
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-neutral-500">Manage product categories and navigation.</p>
                </div>
                <Button onClick={openCreateDialog}>
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
                    </DialogHeader>
                    <CategoryForm
                        initialData={editingCategory}
                        onSubmit={editingCategory ? handleUpdate : handleCreate}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">Icon</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Products</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-neutral-500">
                                    No categories found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell className="text-2xl">{cat.icon}</TableCell>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell className="text-neutral-500">{cat.slug}</TableCell>
                                    <TableCell>{cat._count?.products || 0}</TableCell>
                                    <TableCell>{cat.displayOrder}</TableCell>
                                    <TableCell>
                                        <Badge variant={cat.isActive ? 'default' : 'secondary'}>
                                            {cat.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(cat)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(cat.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
