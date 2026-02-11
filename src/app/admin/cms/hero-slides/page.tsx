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
import { Edit, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { HeroSlideForm } from '@/components/admin/cms/hero-slide-form'
import { toast } from 'sonner'
import Image from 'next/image'

import { HeroSlide, Prisma } from '@prisma/client'

export default function HeroSlidesPage() {
    const [slides, setSlides] = useState<HeroSlide[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)

    const fetchSlides = async () => {
        try {
            const res = await fetch('/api/admin/hero-slides')
            const json = await res.json()
            if (json.data) {
                setSlides(json.data)
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to load slides')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchSlides()
    }, [])

    const handleCreate = async (data: Prisma.HeroSlideCreateInput) => {
        const res = await fetch('/api/admin/hero-slides', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })

        if (res.ok) {
            fetchSlides()
            setIsDialogOpen(false)
        } else {
            throw new Error('Failed to create')
        }
    }

    const handleUpdate = async (data: Prisma.HeroSlideUpdateInput) => {
        if (!editingSlide) return

        const res = await fetch(`/api/admin/hero-slides/${editingSlide.id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })

        if (res.ok) {
            fetchSlides()
            setIsDialogOpen(false)
            setEditingSlide(null)
        } else {
            throw new Error('Failed to update')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this slide?')) return

        try {
            const res = await fetch(`/api/admin/hero-slides/${id}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                toast.success('Slide deleted')
                fetchSlides()
            }
        } catch (error) {
            toast.error('Failed to delete')
        }
    }

    const openCreateDialog = () => {
        setEditingSlide(null)
        setIsDialogOpen(true)
    }

    const openEditDialog = (slide: HeroSlide) => {
        setEditingSlide(slide)
        setIsDialogOpen(true)
    }

    const handleSubmit = async (data: Prisma.HeroSlideCreateInput | Prisma.HeroSlideUpdateInput) => {
        if (editingSlide) {
            await handleUpdate(data as Prisma.HeroSlideUpdateInput)
        } else {
            await handleCreate(data as Prisma.HeroSlideCreateInput)
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Hero Slides</h1>
                    <p className="text-neutral-500">Manage homepage hero carousel slides.</p>
                </div>
                <Button onClick={openCreateDialog}>
                    <Plus className="mr-2 h-4 w-4" /> Add Slide
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingSlide ? 'Edit Slide' : 'Create New Slide'}</DialogTitle>
                    </DialogHeader>
                    <HeroSlideForm
                        initialData={editingSlide}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : slides.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-neutral-500">
                                    No slides found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            slides.map((slide) => (
                                <TableRow key={slide.id}>
                                    <TableCell>
                                        <div className="relative w-16 h-10 bg-neutral-100 rounded overflow-hidden">
                                            <Image
                                                src={slide.image}
                                                alt={slide.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{slide.title}</TableCell>
                                    <TableCell>{slide.sortOrder}</TableCell>
                                    <TableCell>
                                        <Badge variant={slide.isActive ? 'default' : 'secondary'}>
                                            {slide.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(slide)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(slide.id)}>
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
