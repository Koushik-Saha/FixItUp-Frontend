-- Additional Features Migration
-- This migration adds reviews, wishlists, coupons, addresses, and notifications

-- Product reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT NOT NULL CHECK (LENGTH(comment) >= 10),
    images TEXT[],
    videos TEXT[],
    verified_purchase BOOLEAN DEFAULT false,
    quality_grade VARCHAR(20) CHECK (quality_grade IN ('OEM', 'Premium', 'Standard')),
    device_model VARCHAR(100),
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, user_id)
);

-- Wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    price_alert_threshold DECIMAL(10,2),
    price_alert_enabled BOOLEAN DEFAULT false,
    stock_alert_enabled BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Coupons/Discounts table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),
    min_purchase DECIMAL(10,2) DEFAULT 0,
    max_discount DECIMAL(10,2),
    max_uses INTEGER,
    times_used INTEGER DEFAULT 0,
    max_uses_per_user INTEGER DEFAULT 1,
    applies_to VARCHAR(20) DEFAULT 'all' CHECK (applies_to IN ('all', 'specific_products', 'specific_categories')),
    applicable_product_ids UUID[],
    applicable_category_ids UUID[],
    user_restrictions VARCHAR(20) DEFAULT 'all' CHECK (user_restrictions IN ('all', 'new_customers', 'wholesale', 'retail')),
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coupon usage tracking
CREATE TABLE IF NOT EXISTS coupon_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    order_id UUID REFERENCES orders(id),
    discount_applied DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved addresses table
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('shipping', 'billing', 'both')),
    is_default BOOLEAN DEFAULT false,
    label VARCHAR(50),
    full_name VARCHAR(255) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(50) DEFAULT 'US',
    phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('order', 'repair', 'wholesale', 'stock_alert', 'price_drop', 'promotion', 'system')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(500),
    metadata JSONB,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product stock alerts table
CREATE TABLE IF NOT EXISTS stock_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    notified BOOLEAN DEFAULT false,
    notified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Homepage banners table
CREATE TABLE IF NOT EXISTS homepage_banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    image_url VARCHAR(500) NOT NULL,
    mobile_image_url VARCHAR(500),
    link_url VARCHAR(500),
    link_text VARCHAR(100),
    background_color VARCHAR(50),
    text_color VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON wishlists(product_id);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_is_active ON coupons(is_active);
CREATE INDEX idx_coupons_expires_at ON coupons(expires_at);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_is_default ON addresses(is_default);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

CREATE INDEX idx_stock_alerts_product_id ON stock_alerts(product_id);
CREATE INDEX idx_stock_alerts_notified ON stock_alerts(notified);

CREATE INDEX idx_homepage_banners_is_active ON homepage_banners(is_active);
CREATE INDEX idx_homepage_banners_display_order ON homepage_banners(display_order);

-- Apply update timestamp triggers
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wishlists_updated_at BEFORE UPDATE ON wishlists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_homepage_banners_updated_at BEFORE UPDATE ON homepage_banners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Helper function to check if coupon is valid
CREATE OR REPLACE FUNCTION validate_coupon(
    coupon_code VARCHAR,
    user_id_param UUID,
    cart_total DECIMAL,
    product_ids UUID[]
)
RETURNS TABLE (
    is_valid BOOLEAN,
    discount_amount DECIMAL,
    error_message TEXT
) AS $$
DECLARE
    coupon_record RECORD;
    user_usage_count INTEGER;
    calculated_discount DECIMAL;
BEGIN
    -- Get coupon
    SELECT * INTO coupon_record FROM coupons WHERE code = coupon_code AND is_active = true;

    -- Check if coupon exists
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Invalid coupon code'::TEXT;
        RETURN;
    END IF;

    -- Check expiration
    IF coupon_record.expires_at IS NOT NULL AND coupon_record.expires_at < NOW() THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Coupon has expired'::TEXT;
        RETURN;
    END IF;

    -- Check start date
    IF coupon_record.starts_at > NOW() THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Coupon is not yet active'::TEXT;
        RETURN;
    END IF;

    -- Check max uses
    IF coupon_record.max_uses IS NOT NULL AND coupon_record.times_used >= coupon_record.max_uses THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Coupon usage limit reached'::TEXT;
        RETURN;
    END IF;

    -- Check per-user usage
    IF user_id_param IS NOT NULL THEN
        SELECT COUNT(*) INTO user_usage_count FROM coupon_usage WHERE coupon_id = coupon_record.id AND user_id = user_id_param;
        IF user_usage_count >= coupon_record.max_uses_per_user THEN
            RETURN QUERY SELECT false, 0::DECIMAL, 'You have already used this coupon'::TEXT;
            RETURN;
        END IF;
    END IF;

    -- Check minimum purchase
    IF cart_total < coupon_record.min_purchase THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Minimum purchase amount not met'::TEXT;
        RETURN;
    END IF;

    -- Calculate discount
    IF coupon_record.discount_type = 'percentage' THEN
        calculated_discount := ROUND(cart_total * (coupon_record.discount_value / 100), 2);
        IF coupon_record.max_discount IS NOT NULL AND calculated_discount > coupon_record.max_discount THEN
            calculated_discount := coupon_record.max_discount;
        END IF;
    ELSE
        calculated_discount := coupon_record.discount_value;
    END IF;

    RETURN QUERY SELECT true, calculated_discount, ''::TEXT;
END;
$$ LANGUAGE plpgsql;
