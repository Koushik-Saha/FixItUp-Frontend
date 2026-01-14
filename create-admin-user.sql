-- ========================================
-- CREATE ADMIN USER
-- Run this after creating a user account
-- ========================================

-- Step 1: First, sign up normally through the frontend at:
-- http://localhost:3000/auth/register
-- Email: admin@maxfixit.com
-- Password: (your choice)

-- Step 2: Then run this query to promote the user to admin:

UPDATE public.profiles
SET role = 'admin'
WHERE id = (
    SELECT id FROM auth.users
    WHERE email = 'admin@maxfixit.com'
);

-- Step 3: Verify the admin user was created:

SELECT
    p.id,
    u.email,
    p.role,
    p.full_name,
    p.created_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin';

-- ========================================
-- ALTERNATIVE: If you already have a user account
-- ========================================

-- Just update YOUR user ID to admin:

-- First, find your user ID:
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then update it:
UPDATE public.profiles
SET role = 'admin'
WHERE id = 'YOUR-USER-ID-HERE';

-- ========================================
-- SUCCESS!
-- ========================================

-- After running this, you can:
-- 1. Login to the admin panel at http://localhost:3001
-- 2. Use your admin credentials
-- 3. Access all admin features!
