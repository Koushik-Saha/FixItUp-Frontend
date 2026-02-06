import { Suspense } from "react";
import ShopContent from "./shop-content";
import { ProductGridSkeleton } from "@/components/skeletons/product-grid-skeleton";

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-8"><ProductGridSkeleton /></div>}>
            <ShopContent />
        </Suspense>
    );
}
