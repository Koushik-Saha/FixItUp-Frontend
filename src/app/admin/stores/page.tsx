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
import { Edit, Plus, Trash2, MapPin } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { StoreForm } from '@/components/admin/cms/store-form'
import { toast } from 'sonner'

import { Store, Prisma } from '@prisma/client'

export default function StoresPage() {
    const [stores, setStores] = useState<Store[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingStore, setEditingStore] = useState<Store | null>(null)

    const fetchStores = async () => {
        try {
            const res = await fetch('/api/admin/stores')
            const json = await res.json()
            if (json.data) {
                setStores(json.data)
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to load stores')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchStores()
    }, [])

    const handleCreate = async (data: Prisma.StoreCreateInput) => {
        const res = await fetch('/api/admin/stores', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })

        const json = await res.json()
        if (res.ok) {
            fetchStores()
            setIsDialogOpen(false)
        } else {
            throw new Error(json.error || 'Failed to create')
        }
    }

    const handleUpdate = async (data: Prisma.StoreUpdateInput) => {
        if (!editingStore) return

        const res = await fetch(`/api/admin/stores/${editingStore.id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })

        const json = await res.json()
        if (res.ok) {
            fetchStores()
            setIsDialogOpen(false)
            setEditingStore(null)
        } else {
            throw new Error(json.error || 'Failed to update')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this store?')) return

        try {
            const res = await fetch(`/api/admin/stores/${id}`, {
                method: 'DELETE'
            })
            const json = await res.json()
            if (res.ok) {
                toast.success('Store deleted')
                fetchStores()
            } else {
                toast.error(json.error || 'Failed to delete')
            }
        } catch (error) {
            toast.error('Failed to delete')
        }
    }

    const openCreateDialog = () => {
        setEditingStore(null)
        setIsDialogOpen(true)
    }

    const openEditDialog = (store: Store) => {
        setEditingStore(store)
        setIsDialogOpen(true)
    }

    const handleSubmit = async (data: Prisma.StoreCreateInput | Prisma.StoreUpdateInput) => {
        if (editingStore) {
            await handleUpdate(data as Prisma.StoreUpdateInput)
        } else {
            await handleCreate(data as Prisma.StoreCreateInput)
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Stores</h1>
                    <p className="text-neutral-500">Manage store locations and hours.</p>
                </div>
                <Button onClick={openCreateDialog}>
                    <Plus className="mr-2 h-4 w-4" /> Add Store
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingStore ? 'Edit Store' : 'Create New Store'}</DialogTitle>
                    </DialogHeader>
                    <StoreForm
                        initialData={editingStore}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Store Name</TableHead>
                            <TableHead>City/State</TableHead>
                            <TableHead>Hours (Today)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : stores.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-neutral-500">
                                    No stores found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            stores.map((store) => (
                                <TableRow key={store.id}>
                                    <TableCell>
                                        <div className="p-2 bg-neutral-100 rounded-full w-8 h-8 flex items-center justify-center">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {store.name}
                                        <div className="text-xs text-neutral-500 font-normal">{store.address}</div>
                                    </TableCell>
                                    <TableCell>{store.city}, {store.state}</TableCell>
                                    <TableCell className="text-sm">
                                        {(store.operatingHours as Record<string, string> | null)?.['Mon-Fri'] || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={store.isActive ? 'default' : 'secondary'}>
                                            {store.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(store)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(store.id)}>
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
