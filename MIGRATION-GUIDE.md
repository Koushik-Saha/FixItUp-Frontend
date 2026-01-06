# Database Migration Guide

## 🎯 Quick Start

Follow these steps to fix your database issues:

### Step 1: Run the Main Migration (Required Tables)
Copy and paste this into Supabase SQL Editor:

```sql
-- ========================================
-- CRITICAL MISSING TABLES
-- ========================================

-- 1. Coupons table
CREATE TABLE public.coupons (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
    minimum_purchase NUMERIC(10,2) DEFAULT 0,
    maximum_discount NUMERIC(10,2),
    max_uses INTEGER,
    max_uses_per_user INTEGER DEFAULT 1,
    times_used INTEGER DEFAULT 0,
    applies_to TEXT DEFAULT 'all' CHECK (applies_to IN ('all', 'specific_products', 'specific_categories')),
    product_ids UUID[] DEFAULT '{}',
    category_ids UUID[] DEFAULT '{}',
    user_restrictions TEXT DEFAULT 'all' CHECK (user_restrictions IN ('all', 'new_customers', 'wholesale_only')),
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coupons_code ON public.coupons(code);
CREATE INDEX idx_coupons_is_active ON public.coupons(is_active);
CREATE INDEX idx_coupons_dates ON public.coupons(start_date, end_date);

-- 2. Coupon usage tracking
CREATE TABLE public.coupon_usage (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    discount_amount NUMERIC(10,2) NOT NULL,
    used_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coupon_usage_coupon_id ON public.coupon_usage(coupon_id);
CREATE INDEX idx_coupon_usage_user_id ON public.coupon_usage(user_id);
CREATE INDEX idx_coupon_usage_order_id ON public.coupon_usage(order_id);

-- 3. Wishlists
CREATE TABLE public.wishlists (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON public.wishlists(product_id);

-- 4. Order status history (audit trail)
CREATE TABLE public.order_status_history (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_status_history_order_id ON public.order_status_history(order_id);

-- 5. Stock alerts
CREATE TABLE public.stock_alerts (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    notified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, user_email)
);

CREATE INDEX idx_stock_alerts_product_id ON public.stock_alerts(product_id);
CREATE INDEX idx_stock_alerts_notified_at ON public.stock_alerts(notified_at);

-- Add is_guest column to orders
ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT FALSE;

CREATE INDEX idx_orders_is_guest ON public.orders(is_guest);
```

**✅ Run this first** - These tables are required for your admin API to work!

---

### Step 2: Add Foreign Keys (Data Integrity)
Copy and paste this:

```sql
-- Add missing foreign keys
ALTER TABLE public.cart_items
    ADD CONSTRAINT fk_cart_items_user_id
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.cart_items
    ADD CONSTRAINT fk_cart_items_product_id
    FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE public.inventory
    ADD CONSTRAINT fk_inventory_product_id
    FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE public.inventory
    ADD CONSTRAINT fk_inventory_store_id
    FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;

ALTER TABLE public.orders
    ADD CONSTRAINT fk_orders_user_id
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.order_items
    ADD CONSTRAINT fk_order_items_order_id
    FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

ALTER TABLE public.products
    ADD CONSTRAINT fk_products_category_id
    FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;

ALTER TABLE public.products
    ADD CONSTRAINT fk_products_model_id
    FOREIGN KEY (model_id) REFERENCES public.product_models(id) ON DELETE SET NULL;

ALTER TABLE public.repair_tickets
    ADD CONSTRAINT fk_repair_tickets_customer_id
    FOREIGN KEY (customer_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.repair_tickets
    ADD CONSTRAINT fk_repair_tickets_store_id
    FOREIGN KEY (assigned_store_id) REFERENCES public.stores(id) ON DELETE SET NULL;

ALTER TABLE public.reviews
    ADD CONSTRAINT fk_reviews_product_id
    FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE public.reviews
    ADD CONSTRAINT fk_reviews_user_id
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.reviews
    ADD CONSTRAINT fk_reviews_order_id
    FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;

ALTER TABLE public.wholesale_applications
    ADD CONSTRAINT fk_wholesale_applications_user_id
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

---

### Step 3: Add Performance Indexes
Copy and paste this:

```sql
-- Product indexes
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_device_model ON public.products(device_model);
CREATE INDEX IF NOT EXISTS idx_products_product_type ON public.products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON public.products(is_new);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_base_price ON public.products(base_price);

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Repair ticket indexes
CREATE INDEX IF NOT EXISTS idx_repair_tickets_customer_id ON public.repair_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_repair_tickets_status ON public.repair_tickets(status);
CREATE INDEX IF NOT EXISTS idx_repair_tickets_created_at ON public.repair_tickets(created_at DESC);

-- Review indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON public.reviews(is_approved);

-- Cart indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON public.cart_items(session_id);

-- Inventory indexes
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_store_id ON public.inventory(store_id);

-- Category indexes
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);

-- Partial indexes for common queries
CREATE INDEX IF NOT EXISTS idx_products_active_featured
ON public.products(is_featured, base_price)
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_orders_pending
ON public.orders(created_at DESC)
WHERE status = 'pending';
```

---

### Step 4 (OPTIONAL): Convert TEXT to ENUM
⚠️ **Only run this if you want stricter type safety**

See `database-migration-fixes.sql` for the complete script.

This step:
- Converts status columns from TEXT to ENUM types
- Provides better type safety and performance
- Removes CHECK constraints (no longer needed)

**Note:** This requires carefully handling existing data and default values.

---

### Step 5 (OPTIONAL): Enable Row Level Security
⚠️ **Only run this if you want RLS enabled**

See `database-migration-fixes.sql` for the complete script.

This step:
- Enables RLS on key tables
- Creates policies for users to access their own data
- Creates admin override policies

**Note:** Make sure you have admin accounts set up first!

---

## 🧪 Testing After Migration

Run these queries to verify everything worked:

```sql
-- Check if coupons table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'coupons'
);

-- Check if foreign keys were added
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type
FROM information_schema.table_constraints tc
WHERE tc.table_schema = 'public'
AND tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;

-- Check if indexes were created
SELECT
    tablename,
    indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('products', 'orders', 'cart_items')
ORDER BY tablename, indexname;

-- Count rows in new tables
SELECT 'coupons' as table_name, COUNT(*) as row_count FROM public.coupons
UNION ALL
SELECT 'coupon_usage', COUNT(*) FROM public.coupon_usage
UNION ALL
SELECT 'wishlists', COUNT(*) FROM public.wishlists
UNION ALL
SELECT 'order_status_history', COUNT(*) FROM public.order_status_history
UNION ALL
SELECT 'stock_alerts', COUNT(*) FROM public.stock_alerts;
```

---

## 📋 What Was Fixed

### ✅ Critical Issues Fixed:
1. **Added coupons table** - Your admin coupon API will now work
2. **Added coupon_usage table** - Track coupon redemptions
3. **Added wishlists table** - Your wishlist page now has a backend
4. **Added order_status_history** - Audit trail for order changes
5. **Added stock_alerts** - Email notifications for low stock
6. **Added is_guest column** - Guest checkout now properly tracked
7. **Added foreign keys** - Data integrity enforced
8. **Added indexes** - Better query performance

### ✅ Optional Enhancements:
- ENUM types for status fields (type safety)
- Row Level Security policies (security)
- Materialized views (advanced performance)

---

## ❓ Troubleshooting

### Error: "relation already exists"
**Solution:** The table already exists. Skip that CREATE TABLE statement or use:
```sql
CREATE TABLE IF NOT EXISTS public.coupons (...);
```

### Error: "constraint already exists"
**Solution:** The foreign key already exists. You can skip it or use:
```sql
DO $$
BEGIN
    ALTER TABLE public.cart_items
        ADD CONSTRAINT fk_cart_items_user_id
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
```

### Error: "default cannot be cast automatically to type"
**Solution:** Use `database-migration-fixes.sql` which properly handles ENUM conversions.

### Error: "policy already exists"
**Solution:** Use `database-migration-fixes.sql` which drops existing policies first.

---

## 🎉 Next Steps

After running the migration:

1. **Test your admin coupon API** - Create, edit, delete coupons
2. **Test guest checkout** - Place an order without logging in
3. **Check performance** - Queries should be faster with new indexes
4. **Enable RLS** (optional) - For production security
5. **Set up backups** - Use Supabase's built-in backup feature

---

## 📞 Need Help?

If you encounter any issues:
1. Check the error message in Supabase SQL Editor
2. Review `database-analysis-and-recommendations.md` for detailed explanations
3. Use `database-migration-fixes.sql` for common migration errors
4. Check Supabase logs for runtime errors
