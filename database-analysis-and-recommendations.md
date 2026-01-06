# Database Structure Analysis & Recommendations

## ⚠️ QUICK FIX: Common Migration Errors

If you encountered these errors when running the migration script:

### Error 1: `default for column "status" cannot be cast automatically to type order_status`
**Solution:** Use `database-migration-fixes.sql` - it properly handles ENUM conversions by dropping defaults first.

### Error 2: `policy "Users can view own profile" already exists`
**Solution:** Use `database-migration-fixes.sql` - it drops existing policies before recreating them.

**✅ Use this file for a clean migration:** `database-migration-fixes.sql`

---

## Executive Summary

Your Supabase PostgreSQL database is **well-structured** for an e-commerce phone repair business. The schema demonstrates good normalization, proper use of constraints, and leverages PostgreSQL features effectively. However, there are **critical missing tables** and several optimization opportunities.

**Recommendation: Continue using Supabase (PostgreSQL)** - No need to migrate to MySQL/NoSQL.

---

## Current Database Structure

### ✅ Existing Tables (16 tables)

1. **cart_items** - Shopping cart functionality
2. **categories** - Product categorization with hierarchy
3. **hero_slides** - Homepage carousel content
4. **homepage_banners** - Marketing banners
5. **homepage_settings** - Global homepage configuration
6. **inventory** - Multi-store inventory tracking
7. **navigation_items** - Dynamic navigation structure
8. **order_items** - Order line items
9. **orders** - Customer orders
10. **product_models** - Device models (iPhone 17 Pro, etc.)
11. **products** - Product catalog
12. **profiles** - User profiles (customers, wholesale, admin)
13. **repair_tickets** - Repair service requests
14. **reviews** - Product reviews
15. **stores** - Physical store locations
16. **wholesale_applications** - Wholesale account requests

---

## 🚨 Critical Missing Tables

### 1. **coupons** Table
**Status:** MISSING (Required by your admin API endpoints)

You've implemented admin coupon API endpoints but the database table doesn't exist!

```sql
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
```

### 2. **coupon_usage** Table
**Status:** MISSING (Required for tracking coupon redemptions)

```sql
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
```

### 3. **wishlists** Table
**Status:** MISSING (You have a `/wishlist` page but no backend)

```sql
CREATE TABLE public.wishlists (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON public.wishlists(product_id);
```

### 4. **order_status_history** Table
**Status:** MISSING (Audit trail for order status changes)

```sql
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
```

### 5. **stock_alerts** Table
**Status:** MISSING (Low stock email notifications)

```sql
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
```

---

## ⚠️ Structural Issues & Recommendations

### Issue 1: Missing Foreign Keys
**Problem:** Several tables lack foreign key constraints, which can lead to orphaned records.

**Fix:**
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

### Issue 2: Missing Indexes for Query Performance
**Problem:** Several frequently queried columns lack indexes.

**Fix:**
```sql
-- Product search and filtering
CREATE INDEX idx_products_brand ON public.products(brand);
CREATE INDEX idx_products_device_model ON public.products(device_model);
CREATE INDEX idx_products_product_type ON public.products(product_type);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_products_is_featured ON public.products(is_featured);
CREATE INDEX idx_products_is_new ON public.products(is_new);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_base_price ON public.products(base_price);

-- Orders filtering and sorting
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);

-- Repair tickets
CREATE INDEX idx_repair_tickets_customer_id ON public.repair_tickets(customer_id);
CREATE INDEX idx_repair_tickets_status ON public.repair_tickets(status);
CREATE INDEX idx_repair_tickets_created_at ON public.repair_tickets(created_at DESC);

-- Reviews
CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_is_approved ON public.reviews(is_approved);

-- Cart items
CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX idx_cart_items_session_id ON public.cart_items(session_id);

-- Inventory
CREATE INDEX idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX idx_inventory_store_id ON public.inventory(store_id);

-- Categories
CREATE INDEX idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX idx_categories_is_active ON public.categories(is_active);
```

### Issue 3: `orders` Table Missing `is_guest` Column
**Problem:** Your guest checkout implementation requires an `is_guest` flag, but it doesn't exist.

**Fix:**
```sql
ALTER TABLE public.orders
    ADD COLUMN is_guest BOOLEAN DEFAULT FALSE;

CREATE INDEX idx_orders_is_guest ON public.orders(is_guest);
```

### Issue 4: No Soft Delete on Products
**Problem:** Your admin API does soft delete (`is_active = false`), but there's no mechanism to filter out inactive products by default.

**Recommendation:** Already handled by your `is_active` boolean. Just ensure your queries filter by `is_active = true`.

### Issue 5: Inventory Reserved Quantity Not Being Used
**Problem:** The `inventory.reserved_quantity` column exists but there's no clear trigger or logic to automatically update it when orders are placed.

**Fix:** Create a database function and trigger:
```sql
-- Function to reserve inventory on order creation
CREATE OR REPLACE FUNCTION reserve_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Update reserved quantity for each order item
    UPDATE public.inventory
    SET
        reserved_quantity = reserved_quantity + NEW.quantity,
        updated_at = NOW()
    WHERE product_id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on order_items insert
CREATE TRIGGER trigger_reserve_inventory_on_order
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION reserve_inventory_on_order();

-- Function to release inventory on order cancellation
CREATE OR REPLACE FUNCTION release_inventory_on_cancel()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        -- Release reserved inventory for all items in the order
        UPDATE public.inventory
        SET
            reserved_quantity = GREATEST(0, reserved_quantity - oi.quantity),
            updated_at = NOW()
        FROM public.order_items oi
        WHERE
            oi.order_id = NEW.id
            AND public.inventory.product_id = oi.product_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on orders update
CREATE TRIGGER trigger_release_inventory_on_cancel
AFTER UPDATE ON public.orders
FOR EACH ROW
WHEN (NEW.status = 'cancelled')
EXECUTE FUNCTION release_inventory_on_cancel();
```

### Issue 6: No Product Variant Support
**Problem:** You sell phone parts, which often have variants (color, storage, condition).

**Recommendation:** Consider adding a `product_variants` table:
```sql
CREATE TABLE public.product_variants (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_name TEXT NOT NULL, -- e.g., "Black - 128GB - Grade A"
    sku TEXT NOT NULL UNIQUE,
    price_adjustment NUMERIC(10,2) DEFAULT 0, -- difference from base_price
    stock INTEGER DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    attributes JSONB, -- {"color": "Black", "storage": "128GB", "condition": "Grade A"}
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON public.product_variants(sku);
```

---

## 🎯 Data Type Improvements

### Issue 7: Using TEXT Instead of ENUM for Status Fields
**Problem:** TEXT fields for statuses allow invalid values despite CHECK constraints.

**Better Approach (PostgreSQL ENUMs):**

**⚠️ IMPORTANT:** When converting TEXT columns with DEFAULT values to ENUM, you must:
1. Drop the default constraint first
2. Convert the column type
3. Re-add the default with the ENUM type

**FIXED VERSION (see `database-migration-fixes.sql`):**
```sql
-- Create custom types
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Migrate orders.status (proper way)
ALTER TABLE public.orders ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.orders ALTER COLUMN status TYPE order_status USING status::order_status;
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'pending'::order_status;

-- Drop old CHECK constraint (no longer needed)
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
```

**Why this is better:**
- Type safety at the database level
- Better performance (ENUMs are stored as integers internally)
- IDE auto-completion support
- No need for CHECK constraints

---

## 📊 Should You Switch from Supabase to MySQL/PostgreSQL/NoSQL?

### **Answer: NO - Stay with Supabase (PostgreSQL)**

**Reasons to Stay:**

1. **PostgreSQL is Superior for E-commerce**
   - ACID compliance ensures data consistency for orders/payments
   - Advanced indexing (GIN, GiST) for JSONB queries
   - Full-text search built-in
   - Array types and JSONB for flexible schemas
   - Excellent for complex queries (joins, aggregations)

2. **Supabase Benefits**
   - Built-in authentication (already integrated)
   - Row Level Security (RLS) for data access control
   - Real-time subscriptions (useful for admin dashboards)
   - Storage buckets for product images
   - Auto-generated REST API (not using it now, but available)
   - Free tier is generous
   - Easy backups and migrations

3. **MySQL Comparison**
   - PostgreSQL has better JSONB support (you use it heavily)
   - PostgreSQL has superior indexing
   - MySQL lacks array types
   - No significant advantage for your use case

4. **NoSQL Comparison**
   - E-commerce requires ACID transactions (NoSQL doesn't guarantee this)
   - Complex relational data (orders, inventory, products) - SQL is better
   - NoSQL is for unstructured data or massive scale (you don't have this)
   - Would require rewriting entire backend

**When to Consider Switching:**
- If you need extreme horizontal scaling (millions of products/orders per day)
- If Supabase pricing becomes too expensive (check at >100K rows)
- If you need specific MySQL-only features (unlikely)

---

## 🔐 Security Recommendations

### Enable Row Level Security (RLS)

Supabase supports RLS, but your schema may already have some policies enabled.

**⚠️ IMPORTANT:** If you get errors like `policy "X" already exists`, use the fixed migration script which drops existing policies first.

**FIXED VERSION (see `database-migration-fixes.sql`):**
```sql
-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
-- ... (drop all existing policies)

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_tickets ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view/update their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Orders: Users can view their own orders
CREATE POLICY "Users can view own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id OR is_guest = true);

-- Cart: Users can manage their own cart
CREATE POLICY "Users can manage own cart"
ON public.cart_items FOR ALL
USING (auth.uid() = user_id);

-- Reviews: Users can view all approved reviews
CREATE POLICY "Anyone can view approved reviews"
ON public.reviews FOR SELECT
USING (is_approved = true);

CREATE POLICY "Users can create reviews"
ON public.reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Repair tickets: Users can view their own tickets
CREATE POLICY "Users can view own tickets"
ON public.repair_tickets FOR SELECT
USING (auth.uid() = customer_id);

-- Admin override policies
CREATE POLICY "Admins can do anything on profiles"
ON public.profiles FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Admins can do anything on orders"
ON public.orders FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);
```

---

## 📈 Performance Optimizations

### 1. Add Materialized View for Product Statistics

```sql
CREATE MATERIALIZED VIEW product_stats AS
SELECT
    p.id,
    p.name,
    p.sku,
    COUNT(DISTINCT r.id) as review_count,
    AVG(r.rating) as avg_rating,
    COUNT(DISTINCT oi.order_id) as times_ordered,
    SUM(oi.quantity) as total_quantity_sold
FROM public.products p
LEFT JOIN public.reviews r ON p.id = r.product_id AND r.is_approved = true
LEFT JOIN public.order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, p.sku;

CREATE UNIQUE INDEX idx_product_stats_id ON product_stats(id);

-- Refresh hourly or on demand
REFRESH MATERIALIZED VIEW product_stats;
```

### 2. Add Partial Indexes

```sql
-- Index only active products (most queries filter by is_active)
CREATE INDEX idx_products_active_featured
ON public.products(is_featured, base_price)
WHERE is_active = true;

-- Index only pending orders
CREATE INDEX idx_orders_pending
ON public.orders(created_at DESC)
WHERE status = 'pending';
```

---

## 🛠️ Database Migration Script

Complete SQL script to implement all recommendations:

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

-- ========================================
-- STRUCTURAL FIXES
-- ========================================

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

-- Add is_guest column to orders
ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT FALSE;

CREATE INDEX idx_orders_is_guest ON public.orders(is_guest);

-- ========================================
-- PERFORMANCE INDEXES
-- ========================================

-- Product indexes
CREATE INDEX idx_products_brand ON public.products(brand);
CREATE INDEX idx_products_device_model ON public.products(device_model);
CREATE INDEX idx_products_product_type ON public.products(product_type);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_products_is_featured ON public.products(is_featured);
CREATE INDEX idx_products_is_new ON public.products(is_new);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_base_price ON public.products(base_price);

-- Order indexes
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- Repair ticket indexes
CREATE INDEX idx_repair_tickets_customer_id ON public.repair_tickets(customer_id);
CREATE INDEX idx_repair_tickets_status ON public.repair_tickets(status);
CREATE INDEX idx_repair_tickets_created_at ON public.repair_tickets(created_at DESC);

-- Review indexes
CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_is_approved ON public.reviews(is_approved);

-- Cart indexes
CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX idx_cart_items_session_id ON public.cart_items(session_id);

-- Inventory indexes
CREATE INDEX idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX idx_inventory_store_id ON public.inventory(store_id);

-- Category indexes
CREATE INDEX idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX idx_categories_is_active ON public.categories(is_active);

-- Partial indexes for common queries
CREATE INDEX idx_products_active_featured
ON public.products(is_featured, base_price)
WHERE is_active = true;

CREATE INDEX idx_orders_pending
ON public.orders(created_at DESC)
WHERE status = 'pending';

-- ========================================
-- INVENTORY MANAGEMENT TRIGGERS
-- ========================================

-- Function to reserve inventory on order creation
CREATE OR REPLACE FUNCTION reserve_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.inventory
    SET
        reserved_quantity = reserved_quantity + NEW.quantity,
        updated_at = NOW()
    WHERE product_id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on order_items insert
CREATE TRIGGER trigger_reserve_inventory_on_order
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION reserve_inventory_on_order();

-- Function to release inventory on order cancellation
CREATE OR REPLACE FUNCTION release_inventory_on_cancel()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        UPDATE public.inventory
        SET
            reserved_quantity = GREATEST(0, reserved_quantity - oi.quantity),
            updated_at = NOW()
        FROM public.order_items oi
        WHERE
            oi.order_id = NEW.id
            AND public.inventory.product_id = oi.product_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on orders update
CREATE TRIGGER trigger_release_inventory_on_cancel
AFTER UPDATE ON public.orders
FOR EACH ROW
WHEN (NEW.status = 'cancelled')
EXECUTE FUNCTION release_inventory_on_cancel();

-- ========================================
-- MATERIALIZED VIEW FOR PERFORMANCE
-- ========================================

CREATE MATERIALIZED VIEW product_stats AS
SELECT
    p.id,
    p.name,
    p.sku,
    COUNT(DISTINCT r.id) as review_count,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(DISTINCT oi.order_id) as times_ordered,
    COALESCE(SUM(oi.quantity), 0) as total_quantity_sold
FROM public.products p
LEFT JOIN public.reviews r ON p.id = r.product_id AND r.is_approved = true
LEFT JOIN public.order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, p.sku;

CREATE UNIQUE INDEX idx_product_stats_id ON product_stats(id);

-- Refresh command (run daily via cron or manually)
-- REFRESH MATERIALIZED VIEW product_stats;
```

---

## 📋 Implementation Checklist

- [ ] **Critical:** Create `coupons` table (your admin API needs it!)
- [ ] **Critical:** Create `coupon_usage` table
- [ ] **Important:** Add missing foreign keys for data integrity
- [ ] **Important:** Add `is_guest` column to `orders` table
- [ ] **Recommended:** Create `wishlists` table
- [ ] **Recommended:** Create `order_status_history` table
- [ ] **Recommended:** Create `stock_alerts` table
- [ ] **Recommended:** Add performance indexes
- [ ] **Recommended:** Set up inventory reservation triggers
- [ ] **Optional:** Enable Row Level Security (RLS) policies
- [ ] **Optional:** Create materialized view for product stats
- [ ] **Optional:** Add product variants table

---

## 🎬 Final Verdict

**Your database structure: 7.5/10**

**Strengths:**
- Good normalization
- Proper use of JSONB for flexible data
- Comprehensive order and repair tracking
- Multi-store inventory support
- Wholesale business logic built-in

**Critical Issues:**
- Missing coupon tables (breaking your admin API)
- No foreign keys (data integrity risk)
- Missing indexes (performance issues at scale)

**Stay with Supabase (PostgreSQL).** Just apply the migration script above and you'll have a production-ready database.
