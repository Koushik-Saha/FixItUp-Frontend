// app/shop/page.tsx
import { Suspense } from "react";
import ShopContent from "./shop-content";

export default function ShopPage() {
    return (
        <Suspense fallback={<div>Loading shop...</div>}>
            <ShopContent />
        </Suspense>
    );
}
