# Database Schema Patterns

Common schema patterns for typical application features.

## Authentication & User Management

### Basic User Schema
```sql
CREATE TABLE users (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 email VARCHAR(255) UNIQUE NOT NULL,
 password_hash VARCHAR(255) NOT NULL,
 email_verified BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMP DEFAULT NOW(),
 updated_at TIMESTAMP DEFAULT NOW(),

 INDEX idx_email (email)
);

CREATE TABLE sessions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 token VARCHAR(255) UNIQUE NOT NULL,
 expires_at TIMESTAMP NOT NULL,
 created_at TIMESTAMP DEFAULT NOW(),

 INDEX idx_user_id (user_id),
 INDEX idx_token (token)
);
```

### User Profiles
```sql
CREATE TABLE user_profiles (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 display_name VARCHAR(100),
 avatar_url TEXT,
 bio TEXT,
 location VARCHAR(100),
 website VARCHAR(255),
 created_at TIMESTAMP DEFAULT NOW(),
 updated_at TIMESTAMP DEFAULT NOW(),

 INDEX idx_user_id (user_id)
);
```

### OAuth Integration
```sql
CREATE TABLE oauth_accounts (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 provider VARCHAR(50) NOT NULL, -- 'google', 'github', etc.
 provider_user_id VARCHAR(255) NOT NULL,
 access_token TEXT,
 refresh_token TEXT,
 expires_at TIMESTAMP,
 created_at TIMESTAMP DEFAULT NOW(),

 UNIQUE(provider, provider_user_id),
 INDEX idx_user_id (user_id)
);
```

## Social Features

### Following/Followers
```sql
CREATE TABLE follows (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 created_at TIMESTAMP DEFAULT NOW(),

 UNIQUE(follower_id, following_id),
 INDEX idx_follower (follower_id),
 INDEX idx_following (following_id)
);

-- Denormalized counts for performance
ALTER TABLE user_profiles
 ADD COLUMN followers_count INTEGER DEFAULT 0,
 ADD COLUMN following_count INTEGER DEFAULT 0;
```

### Posts/Feed
```sql
CREATE TABLE posts (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 content TEXT NOT NULL,
 image_url TEXT,
 likes_count INTEGER DEFAULT 0,
 comments_count INTEGER DEFAULT 0,
 shares_count INTEGER DEFAULT 0,
 created_at TIMESTAMP DEFAULT NOW(),
 updated_at TIMESTAMP DEFAULT NOW(),

 INDEX idx_user_id (user_id),
 INDEX idx_created_at (created_at)
);

CREATE TABLE likes (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
 created_at TIMESTAMP DEFAULT NOW(),

 UNIQUE(user_id, post_id),
 INDEX idx_post_id (post_id),
 INDEX idx_user_id (user_id)
);

CREATE TABLE comments (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
 parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
 content TEXT NOT NULL,
 likes_count INTEGER DEFAULT 0,
 created_at TIMESTAMP DEFAULT NOW(),
 updated_at TIMESTAMP DEFAULT NOW(),

 INDEX idx_post_id (post_id),
 INDEX idx_parent_comment (parent_comment_id),
 INDEX idx_user_id (user_id)
);
```

### Notifications
```sql
CREATE TABLE notifications (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 actor_id UUID REFERENCES users(id) ON DELETE CASCADE,
 type VARCHAR(50) NOT NULL, -- 'like', 'comment', 'follow', etc.
 entity_type VARCHAR(50), -- 'post', 'comment', etc.
 entity_id UUID,
 content TEXT,
 read BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMP DEFAULT NOW(),

 INDEX idx_user_id_read (user_id, read),
 INDEX idx_created_at (created_at)
);
```

## E-Commerce

### Products & Inventory
```sql
CREATE TABLE products (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name VARCHAR(255) NOT NULL,
 slug VARCHAR(255) UNIQUE NOT NULL,
 description TEXT,
 price DECIMAL(10, 2) NOT NULL,
 compare_at_price DECIMAL(10, 2),
 cost DECIMAL(10, 2),
 sku VARCHAR(100) UNIQUE,
 barcode VARCHAR(100),
 inventory_quantity INTEGER DEFAULT 0,
 track_inventory BOOLEAN DEFAULT TRUE,
 images JSONB DEFAULT '[]',
 status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'active', 'archived'
 created_at TIMESTAMP DEFAULT NOW(),
 updated_at TIMESTAMP DEFAULT NOW(),

 INDEX idx_slug (slug),
 INDEX idx_status (status)
);

CREATE TABLE product_variants (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
 name VARCHAR(255) NOT NULL,
 sku VARCHAR(100) UNIQUE,
 price DECIMAL(10, 2),
 inventory_quantity INTEGER DEFAULT 0,
 options JSONB, -- {"size": "M", "color": "Red"}
 created_at TIMESTAMP DEFAULT NOW(),

 INDEX idx_product_id (product_id)
);

CREATE TABLE categories (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name VARCHAR(100) NOT NULL,
 slug VARCHAR(100) UNIQUE NOT NULL,
 parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
 description TEXT,
 created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE product_categories (
 product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
 category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
 PRIMARY KEY (product_id, category_id)
);
```

### Orders & Checkout
```sql
CREATE TABLE orders (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID REFERENCES users(id) ON DELETE SET NULL,
 order_number VARCHAR(50) UNIQUE NOT NULL,
 status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'shipped', 'delivered', 'cancelled'
 subtotal DECIMAL(10, 2) NOT NULL,
 tax DECIMAL(10, 2) DEFAULT 0,
 shipping_cost DECIMAL(10, 2) DEFAULT 0,
 total DECIMAL(10, 2) NOT NULL,
 currency VARCHAR(3) DEFAULT 'USD',

 -- Shipping
 shipping_name VARCHAR(255),
 shipping_email VARCHAR(255),
 shipping_address_line1 VARCHAR(255),
 shipping_address_line2 VARCHAR(255),
 shipping_city VARCHAR(100),
 shipping_state VARCHAR(100),
 shipping_postal_code VARCHAR(20),
 shipping_country VARCHAR(2),

 -- Payment
 payment_method VARCHAR(50),
 payment_intent_id VARCHAR(255),

 created_at TIMESTAMP DEFAULT NOW(),
 updated_at TIMESTAMP DEFAULT NOW(),

 INDEX idx_user_id (user_id),
 INDEX idx_status (status),
 INDEX idx_order_number (order_number)
);

CREATE TABLE order_items (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
 product_id UUID REFERENCES products(id) ON DELETE SET NULL,
 variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
 quantity INTEGER NOT NULL,
 price DECIMAL(10, 2) NOT NULL,
 total DECIMAL(10, 2) NOT NULL,

 -- Snapshot data in case product is deleted
 product_name VARCHAR(255),
 product_image TEXT,
 variant_name VARCHAR(255),

 INDEX idx_order_id (order_id)
);

CREATE TABLE carts (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID REFERENCES users(id) ON DELETE CASCADE,
 session_id VARCHAR(255),
 expires_at TIMESTAMP,
 created_at TIMESTAMP DEFAULT NOW(),
 updated_at TIMESTAMP DEFAULT NOW(),

 INDEX idx_user_id (user_id),
 INDEX idx_session_id (session_id)
);

CREATE TABLE cart_items (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
 product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
 variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
 quantity INTEGER NOT NULL DEFAULT 1,
 added_at TIMESTAMP DEFAULT NOW(),

 INDEX idx_cart_id (cart_id)
);
```

## Content Management

### Blog/Articles
```sql
CREATE TABLE articles (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 title VARCHAR(255) NOT NULL,
 slug VARCHAR(255) UNIQUE NOT NULL,
 excerpt TEXT,
 content TEXT NOT NULL,
 featured_image TEXT,
 status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
 published_at TIMESTAMP,
 views_count INTEGER DEFAULT 0,
 reading_time INTEGER, -- minutes
 created_at TIMESTAMP DEFAULT NOW(),
 updated_at TIMESTAMP DEFAULT NOW(),

 INDEX idx_slug (slug),
 INDEX idx_status (status),
 INDEX idx_published_at (published_at),
 INDEX idx_author_id (author_id)
);

CREATE TABLE tags (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name VARCHAR(50) UNIQUE NOT NULL,
 slug VARCHAR(50) UNIQUE NOT NULL,
 created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE article_tags (
 article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
 tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
 PRIMARY KEY (article_id, tag_id)
);
```

## SaaS/Subscription

### Organizations & Teams
```sql
CREATE TABLE organizations (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name VARCHAR(255) NOT NULL,
 slug VARCHAR(255) UNIQUE NOT NULL,
 plan VARCHAR(50) DEFAULT 'free', -- 'free', 'pro', 'enterprise'
 billing_email VARCHAR(255),
 created_at TIMESTAMP DEFAULT NOW(),
 updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE organization_members (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 role VARCHAR(50) NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'member'
 joined_at TIMESTAMP DEFAULT NOW(),

 UNIQUE(organization_id, user_id),
 INDEX idx_user_id (user_id),
 INDEX idx_organization_id (organization_id)
);
```

### Subscriptions
```sql
CREATE TABLE subscriptions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 plan VARCHAR(50) NOT NULL,
 status VARCHAR(50) NOT NULL, -- 'active', 'cancelled', 'past_due'
 stripe_subscription_id VARCHAR(255) UNIQUE,
 stripe_customer_id VARCHAR(255),
 current_period_start TIMESTAMP,
 current_period_end TIMESTAMP,
 cancel_at_period_end BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMP DEFAULT NOW(),
 updated_at TIMESTAMP DEFAULT NOW(),

 INDEX idx_organization_id (organization_id),
 INDEX idx_status (status)
);
```

## Performance Patterns

### Materialized View (PostgreSQL)
```sql
-- For expensive queries like feed generation
CREATE MATERIALIZED VIEW user_feed AS
SELECT
 posts.id,
 posts.user_id,
 posts.content,
 posts.created_at,
 users.display_name,
 users.avatar_url
FROM posts
JOIN follows ON posts.user_id = follows.following_id
JOIN users ON posts.user_id = users.id
ORDER BY posts.created_at DESC;

-- Refresh periodically or on trigger
REFRESH MATERIALIZED VIEW user_feed;
```

### Denormalization for Counts
```sql
-- Instead of COUNT(*) queries, maintain counters
-- Update using triggers or application logic
ALTER TABLE posts
 ADD COLUMN likes_count INTEGER DEFAULT 0,
 ADD COLUMN comments_count INTEGER DEFAULT 0;

-- Trigger example (PostgreSQL)
CREATE OR REPLACE FUNCTION increment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
 UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER likes_count_trigger
AFTER INSERT ON likes
FOR EACH ROW EXECUTE FUNCTION increment_likes_count();
```

### Partitioning for Time-Series Data
```sql
-- For analytics, logs, or high-volume time-series data
CREATE TABLE events (
 id UUID NOT NULL,
 user_id UUID,
 event_type VARCHAR(50),
 properties JSONB,
 created_at TIMESTAMP NOT NULL
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2024_11 PARTITION OF events
 FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');
```

## Common Query Patterns

### Pagination with Cursor
```sql
-- More efficient than OFFSET for large datasets
SELECT * FROM posts
WHERE created_at < :cursor
ORDER BY created_at DESC
LIMIT 20;
```

### Full-text Search (PostgreSQL)
```sql
ALTER TABLE articles
 ADD COLUMN search_vector tsvector;

CREATE INDEX idx_search_vector ON articles USING GIN(search_vector);

-- Update search vector
UPDATE articles
SET search_vector = to_tsvector('english', title || ' ' || content);

-- Search query
SELECT * FROM articles
WHERE search_vector @@ to_tsquery('english', 'database & schema');
```

### Soft Deletes
```sql
ALTER TABLE posts
 ADD COLUMN deleted_at TIMESTAMP;

-- Query excluding deleted
SELECT * FROM posts WHERE deleted_at IS NULL;

-- Index for better performance
CREATE INDEX idx_deleted_at ON posts(deleted_at) WHERE deleted_at IS NULL;
```
