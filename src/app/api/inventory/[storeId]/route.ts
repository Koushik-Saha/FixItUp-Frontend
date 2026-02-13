// app/api/inventory/[storeId]/route.ts
// Get inventory for specific store

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { errorResponse, UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/utils/errors'

// GET /api/inventory/[storeId] - Get inventory for specific store
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { storeId } = await params

        // TODO: Auth Check

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') // low_stock, out_of_stock, all

        // Get inventory for specific store
        const inventory = await prisma.inventory.findMany({
            where: { storeId },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        sku: true,
                        basePrice: true,
                        lowStockThreshold: true,
                        isActive: true
                    }
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                        state: true
                    }
                }
            }
        })

        // Filter by status
        let filteredInventory = inventory || []

        if (status === 'low_stock') {
            filteredInventory = filteredInventory.filter(item => {
                return (item.quantity || 0) > 0 && (item.quantity || 0) <= (item.product.lowStockThreshold || 10)
            })
        } else if (status === 'out_of_stock') {
            filteredInventory = filteredInventory.filter(item => item.quantity === 0)
        }

        // Calculate stats
        const totalItems = filteredInventory.length
        const lowStockItems = filteredInventory.filter(item => {
            return (item.quantity || 0) > 0 && (item.quantity || 0) <= (item.product.lowStockThreshold || 10)
        }).length
        const outOfStockItems = filteredInventory.filter(item => item.quantity === 0).length
        const totalValue = filteredInventory.reduce((sum, item) => {
            return sum + ((item.quantity || 0) * Number(item.product.basePrice || 0))
        }, 0)

        // Get store info
        const store = await prisma.store.findUnique({
            where: { id: storeId }
        })

        if (!store) throw new NotFoundError('Store not found')

        return NextResponse.json({
            data: {
                store,
                inventory: filteredInventory,
                stats: {
                    total_items: totalItems,
                    low_stock: lowStockItems,
                    out_of_stock: outOfStockItems,
                    total_value: Number(totalValue.toFixed(2)),
                },
            },
        })

    } catch (error) {
        return errorResponse(error)
    }
}

// PUT /api/inventory/[storeId] - Update inventory for store
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { storeId } = await params
        const body = await request.json()
        const { product_id, quantity, action } = body

        if (!product_id) {
            return NextResponse.json({ error: 'product_id is required' }, { status: 400 })
        }

        // Get current inventory
        const currentInventory = await prisma.inventory.findUnique({
            where: {
                productId_storeId: {
                    productId: product_id,
                    storeId
                }
            }
        })

        if (!currentInventory) {
            return NextResponse.json({ error: 'Inventory not found for this store' }, { status: 404 })
        }

        let newQuantity = quantity

        const currentQuantity = currentInventory.quantity || 0

        if (action === 'add') {
            newQuantity = currentQuantity + quantity
        } else if (action === 'subtract') {
            newQuantity = Math.max(0, currentQuantity - quantity)
        }

        // Update inventory
        const updated = await prisma.inventory.update({
            where: {
                productId_storeId: {
                    productId: product_id,
                    storeId
                }
            },
            data: {
                quantity: newQuantity,
                lastRestockedAt: action === 'add' ? new Date() : undefined
            }
        })

        return NextResponse.json({
            message: 'Inventory updated successfully',
            data: updated,
        })

    } catch (error) {
        return errorResponse(error)
    }
}
