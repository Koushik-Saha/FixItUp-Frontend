-- ========================================
-- FIXED: Issue 7 - ENUM Status Fields Migration
-- ========================================
-- This properly handles the conversion from TEXT to ENUM by:
-- 1. Dropping the default constraint first
-- 2. Converting the type
-- 3. Re-adding the default

-- Create custom ENUM types
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE repair_status AS ENUM ('submitted', 'confirmed', 'in_progress', 'waiting_parts', 'completed', 'cancelled', 'customer_pickup');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE repair_priority AS ENUM ('low', 'normal', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'wholesale', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE wholesale_status_type AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE wholesale_tier_type AS ENUM ('tier1', 'tier2', 'tier3');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Migrate orders.status to ENUM
ALTER TABLE public.orders
    ALTER COLUMN status DROP DEFAULT;

ALTER TABLE public.orders
    ALTER COLUMN status TYPE order_status
    USING status::order_status;

ALTER TABLE public.orders
    ALTER COLUMN status SET DEFAULT 'pending'::order_status;

-- Migrate orders.payment_status to ENUM
ALTER TABLE public.orders
    ALTER COLUMN payment_status DROP DEFAULT;

ALTER TABLE public.orders
    ALTER COLUMN payment_status TYPE payment_status
    USING payment_status::payment_status;

ALTER TABLE public.orders
    ALTER COLUMN payment_status SET DEFAULT 'pending'::payment_status;

-- Migrate repair_tickets.status to ENUM
ALTER TABLE public.repair_tickets
    ALTER COLUMN status DROP DEFAULT;

ALTER TABLE public.repair_tickets
    ALTER COLUMN status TYPE repair_status
    USING status::repair_status;

ALTER TABLE public.repair_tickets
    ALTER COLUMN status SET DEFAULT 'submitted'::repair_status;

-- Migrate repair_tickets.priority to ENUM
ALTER TABLE public.repair_tickets
    ALTER COLUMN priority DROP DEFAULT;

ALTER TABLE public.repair_tickets
    ALTER COLUMN priority TYPE repair_priority
    USING priority::repair_priority;

ALTER TABLE public.repair_tickets
    ALTER COLUMN priority SET DEFAULT 'normal'::repair_priority;

-- Migrate profiles.role to ENUM
ALTER TABLE public.profiles
    ALTER COLUMN role DROP DEFAULT;

ALTER TABLE public.profiles
    ALTER COLUMN role TYPE user_role
    USING role::user_role;

ALTER TABLE public.profiles
    ALTER COLUMN role SET DEFAULT 'customer'::user_role;

-- Migrate profiles.wholesale_status to ENUM (nullable, no default)
ALTER TABLE public.profiles
    ALTER COLUMN wholesale_status TYPE wholesale_status_type
    USING wholesale_status::wholesale_status_type;

-- Migrate profiles.wholesale_tier to ENUM (nullable, no default)
ALTER TABLE public.profiles
    ALTER COLUMN wholesale_tier TYPE wholesale_tier_type
    USING wholesale_tier::wholesale_tier_type;

-- Drop old CHECK constraints (no longer needed with ENUMs)
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE public.repair_tickets DROP CONSTRAINT IF EXISTS repair_tickets_status_check;
ALTER TABLE public.repair_tickets DROP CONSTRAINT IF EXISTS repair_tickets_priority_check;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_wholesale_status_check;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_wholesale_tier_check;

-- ========================================
-- FIXED: Row Level Security (RLS) Policies
-- ========================================
-- Drop existing policies first to avoid conflicts

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can manage own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can view own tickets" ON public.repair_tickets;
DROP POLICY IF EXISTS "Admins can do anything on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can do anything on orders" ON public.orders;

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

-- Orders: Users can view their own orders (including guest orders with matching email)
CREATE POLICY "Users can view own orders"
ON public.orders FOR SELECT
USING (
    auth.uid() = user_id
    OR (is_guest = true AND customer_email = auth.jwt()->>'email')
);

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

-- Admin override policies (admins can do everything)
CREATE POLICY "Admins can do anything on profiles"
ON public.profiles FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'::user_role
    )
);

CREATE POLICY "Admins can do anything on orders"
ON public.orders FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'::user_role
    )
);

CREATE POLICY "Admins can do anything on cart"
ON public.cart_items FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'::user_role
    )
);

CREATE POLICY "Admins can do anything on reviews"
ON public.reviews FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'::user_role
    )
);

CREATE POLICY "Admins can do anything on repair tickets"
ON public.repair_tickets FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'::user_role
    )
);

-- ========================================
-- Success Message
-- ========================================
DO $$
BEGIN
    RAISE NOTICE '✅ Migration completed successfully!';
    RAISE NOTICE 'Fixed Issues:';
    RAISE NOTICE '  1. TEXT to ENUM conversion (properly handled defaults)';
    RAISE NOTICE '  2. RLS policies (dropped existing before recreating)';
END $$;
