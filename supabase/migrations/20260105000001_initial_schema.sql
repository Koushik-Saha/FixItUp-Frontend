-- Initial Database Schema
-- This migration creates all core tables for the Max Phone Repair e-commerce platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'wholesale', 'admin')),
    wholesale_status VARCHAR(20) CHECK (wholesale_status IN ('pending', 'approved', 'rejected')),
    wholesale_tier VARCHAR(20) CHECK (wholesale_tier IN ('tier1', 'tier2', 'tier3')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category_id UUID REFERENCES categories(id),
    brand VARCHAR(100) NOT NULL,
    device_model VARCHAR(100) NOT NULL,
    product_type VARCHAR(100) NOT NULL,
    description TEXT,
    specifications JSONB,
    base_price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2),
    wholesale_tier1_discount DECIMAL(5,2) DEFAULT 0,
    wholesale_tier2_discount DECIMAL(5,2) DEFAULT 0,
    wholesale_tier3_discount DECIMAL(5,2) DEFAULT 0,
    total_stock INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    images TEXT[],
    thumbnail VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id UUID REFERENCES profiles(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    is_wholesale BOOLEAN DEFAULT false,
    wholesale_tier VARCHAR(20),
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    payment_intent_id VARCHAR(255),
    tracking_number VARCHAR(100),
    carrier VARCHAR(50),
    customer_notes TEXT,
    admin_notes TEXT,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100) NOT NULL,
    product_image VARCHAR(500),
    unit_price DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Repair tickets table
CREATE TABLE IF NOT EXISTS repair_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID REFERENCES profiles(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    device_brand VARCHAR(100) NOT NULL,
    device_model VARCHAR(100) NOT NULL,
    imei_serial VARCHAR(100),
    issue_description TEXT NOT NULL,
    issue_category VARCHAR(100),
    assigned_store_id UUID,
    assigned_technician VARCHAR(255),
    appointment_date TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'confirmed', 'in_progress', 'waiting_parts', 'completed', 'cancelled', 'customer_pickup')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    parts_cost DECIMAL(10,2),
    labor_cost DECIMAL(10,2),
    technician_notes TEXT,
    internal_notes TEXT,
    customer_notes TEXT,
    device_images TEXT[],
    confirmed_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wholesale applications table
CREATE TABLE IF NOT EXISTS wholesale_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    tax_id VARCHAR(50) NOT NULL,
    website VARCHAR(255),
    business_phone VARCHAR(20) NOT NULL,
    business_email VARCHAR(255) NOT NULL,
    business_address JSONB NOT NULL,
    documents TEXT[],
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    requested_tier VARCHAR(20) DEFAULT 'tier1',
    approved_tier VARCHAR(20),
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    operating_hours JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    session_id VARCHAR(255),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id),
    CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    last_restocked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, store_id)
);

-- Create indexes for performance
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_device_model ON products(device_model);
CREATE INDEX idx_products_product_type ON products(product_type);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

CREATE INDEX idx_repair_tickets_customer_id ON repair_tickets(customer_id);
CREATE INDEX idx_repair_tickets_status ON repair_tickets(status);

CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_session_id ON cart_items(session_id);

-- Database functions
CREATE OR REPLACE FUNCTION get_wholesale_price(base_price DECIMAL, tier VARCHAR)
RETURNS DECIMAL AS $$
DECLARE
    discount DECIMAL := 0;
BEGIN
    IF tier = 'tier1' THEN
        discount := 10;
    ELSIF tier = 'tier2' THEN
        discount := 15;
    ELSIF tier = 'tier3' THEN
        discount := 20;
    END IF;

    RETURN ROUND(base_price * (1 - discount / 100), 2);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR AS $$
BEGIN
    RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS VARCHAR AS $$
BEGIN
    RETURN 'TKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update timestamp triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_repair_tickets_updated_at BEFORE UPDATE ON repair_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wholesale_applications_updated_at BEFORE UPDATE ON wholesale_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
