# Database Migrations

This directory contains SQL migration files for the Max Phone Repair database.

## Applying Migrations to Supabase

### Option 1: Using Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the contents of `20260105000001_initial_schema.sql`
5. Paste and run the SQL
6. Repeat for `20260105000002_additional_features.sql`

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (replace with your project ref)
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push

# Or apply specific migration
supabase db push --file supabase/migrations/20260105000001_initial_schema.sql
supabase db push --file supabase/migrations/20260105000002_additional_features.sql
```

### Option 3: Using PostgreSQL client

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run migrations
\i supabase/migrations/20260105000001_initial_schema.sql
\i supabase/migrations/20260105000002_additional_features.sql
```

## What These Migrations Include

### Migration 1: Initial Schema (20260105000001)
- **profiles** - User profiles extending Supabase auth
- **categories** - Product categories
- **products** - Product inventory with wholesale pricing
- **orders** - Customer orders with guest checkout support
- **order_items** - Order line items
- **repair_tickets** - Repair service requests
- **wholesale_applications** - Wholesale account applications
- **stores** - Physical store locations
- **cart_items** - Shopping cart (supports guests and authenticated users)
- **inventory** - Multi-store inventory tracking
- Database functions: `get_wholesale_price()`, `generate_order_number()`, `generate_ticket_number()`
- Indexes for performance optimization
- Triggers for automatic timestamp updates

### Migration 2: Additional Features (20260105000002)
- **reviews** - Product reviews with ratings, images, and helpful votes
- **wishlists** - User wishlists with price/stock alerts
- **coupons** - Discount codes with advanced rules
- **coupon_usage** - Track coupon redemptions
- **addresses** - Saved shipping/billing addresses
- **notifications** - In-app notifications system
- **stock_alerts** - Product back-in-stock notifications
- **homepage_banners** - Dynamic homepage banner management
- Helper function: `validate_coupon()` for coupon validation logic

## Verification

After applying migrations, verify with:

```sql
-- Check all tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check functions
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION';
```

## Row Level Security (RLS)

**IMPORTANT:** After applying migrations, you need to enable Row Level Security (RLS) policies.

Create a file `20260105000003_rls_policies.sql` with:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
-- ... enable for all tables

-- Example policies (customize as needed)

-- Profiles: Users can read all, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Products: Everyone can read active products
CREATE POLICY "Active products are viewable by everyone" ON products FOR SELECT USING (is_active = true);

-- Orders: Users can only see their own orders (or if they're admin)
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Add more policies as needed for your security requirements
```

## Seeding Data

After migrations, you may want to seed initial data:

1. **Categories**: Phone parts categories (screens, batteries, etc.)
2. **Products**: Sample products for testing
3. **Stores**: Your physical store locations
4. **Coupons**: Initial promotional codes

See `../seeds/` directory for seed scripts (create if needed).

## Rollback

To rollback migrations (use with caution):

```sql
-- Drop additional features tables
DROP TABLE IF EXISTS homepage_banners CASCADE;
DROP TABLE IF EXISTS stock_alerts CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS coupon_usage CASCADE;
DROP TABLE IF NOT EXISTS coupons CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

-- Drop core tables
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS wholesale_applications CASCADE;
DROP TABLE IF EXISTS repair_tickets CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS validate_coupon;
DROP FUNCTION IF EXISTS get_wholesale_price;
DROP FUNCTION IF EXISTS generate_order_number;
DROP FUNCTION IF EXISTS generate_ticket_number;
DROP FUNCTION IF EXISTS update_updated_at_column;
```

## Troubleshooting

### Error: "relation already exists"
Some tables might already exist. You can either:
1. Drop the existing table and rerun
2. Comment out that table in the migration file

### Error: "permission denied"
Ensure you're connected as the database owner or have sufficient privileges.

### Error: "function already exists"
Drop the existing function first:
```sql
DROP FUNCTION IF EXISTS function_name CASCADE;
```

## Next Steps

1. Apply migrations to your Supabase database
2. Set up Row Level Security policies
3. Seed initial data (categories, sample products)
4. Update your environment variables with database connection info
5. Test API endpoints with the new tables
