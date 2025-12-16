import { Suspense } from 'react'
import CartContent from './cart-content'

export default function CartPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading carttttt...</div>}>
            <CartContent />
        </Suspense>
    )
}
