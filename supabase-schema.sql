-- DATUM Database Schema for Supabase
-- Run this SQL script in your Supabase SQL Editor to set up your personal DATUM database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
-- Stores user-defined categories for transactions
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    icon TEXT, -- Optional emoji or icon identifier
    color TEXT, -- Hex color for UI display
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags Table
-- Stores user-created tags for flexible transaction organization
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions Table
-- Core table for all financial transactions (encrypted data)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    encrypted_amount TEXT NOT NULL, -- Encrypted amount
    type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'investment')),
    transaction_date DATE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    mood TEXT CHECK (mood IN ('happy', 'necessary', 'impulse', 'regret', NULL)),
    encrypted_notes TEXT, -- Encrypted notes
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction Tags Join Table
-- Many-to-many relationship between transactions and tags
CREATE TABLE IF NOT EXISTS transaction_tags (
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (transaction_id, tag_id)
);

-- Goals Table
-- User financial goals (encrypted data)
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    encrypted_name TEXT NOT NULL, -- Encrypted goal name
    encrypted_target_amount TEXT NOT NULL, -- Encrypted target amount
    target_date DATE,
    current_amount DECIMAL(15, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recurring Transaction Templates
-- Templates for recurring transactions (encrypted data)
CREATE TABLE IF NOT EXISTS recurring_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    encrypted_amount TEXT NOT NULL, -- Encrypted amount
    type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'investment')),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    mood TEXT CHECK (mood IN ('happy', 'necessary', 'impulse', 'regret', NULL)),
    encrypted_notes TEXT, -- Encrypted notes
    recurrence_pattern TEXT NOT NULL CHECK (recurrence_pattern IN ('daily', 'weekly', 'biweekly', 'monthly', 'yearly')),
    next_due_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recurring Template Tags Join Table
CREATE TABLE IF NOT EXISTS recurring_template_tags (
    template_id UUID REFERENCES recurring_templates(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (template_id, tag_id)
);

-- Pending Transactions
-- Queue for recurring transactions awaiting approval
CREATE TABLE IF NOT EXISTS pending_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES recurring_templates(id) ON DELETE CASCADE,
    encrypted_amount TEXT NOT NULL,
    type TEXT NOT NULL,
    proposed_date DATE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    mood TEXT,
    encrypted_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pending Transaction Tags Join Table
CREATE TABLE IF NOT EXISTS pending_transaction_tags (
    pending_transaction_id UUID REFERENCES pending_transactions(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (pending_transaction_id, tag_id)
);

-- User Settings Table
-- Stores app configuration and preferences
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dashboard Widgets Configuration
-- Stores user's dashboard layout and widget preferences
CREATE TABLE IF NOT EXISTS dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    widget_type TEXT NOT NULL,
    position INTEGER NOT NULL,
    configuration JSONB, -- Widget-specific settings
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Insights History
-- Stores AI-generated insights for reference (encrypted)
CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    encrypted_insight TEXT NOT NULL, -- Encrypted AI insight
    insight_type TEXT, -- e.g., 'pattern', 'nudge', 'reinforcement'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_mood ON transactions(mood);
CREATE INDEX IF NOT EXISTS idx_pending_transactions_date ON pending_transactions(proposed_date);
CREATE INDEX IF NOT EXISTS idx_goals_active ON goals(is_active);
CREATE INDEX IF NOT EXISTS idx_recurring_templates_active ON recurring_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_recurring_templates_next_due ON recurring_templates(next_due_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_templates_updated_at BEFORE UPDATE ON recurring_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_widgets_updated_at BEFORE UPDATE ON dashboard_widgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, icon, color) VALUES
    ('Food & Dining', '🍽️', '#f59e0b'),
    ('Transportation', '🚗', '#3b82f6'),
    ('Housing', '🏠', '#10b981'),
    ('Utilities', '💡', '#8b5cf6'),
    ('Healthcare', '🏥', '#ef4444'),
    ('Entertainment', '🎭', '#ec4899'),
    ('Shopping', '🛍️', '#14b8a6'),
    ('Income', '💰', '#22c55e'),
    ('Savings', '🏦', '#6366f1'),
    ('Other', '📦', '#6b7280')
ON CONFLICT DO NOTHING;

-- Insert default dashboard widgets
INSERT INTO dashboard_widgets (widget_type, position, is_visible) VALUES
    ('where-it-went', 1, true),
    ('mood-monitor', 2, true),
    ('net-worth', 3, true),
    ('goal-tracker', 4, true)
ON CONFLICT DO NOTHING;

-- Note: Row Level Security (RLS) is not implemented in this schema
-- because each user runs their own Supabase instance.
-- If implementing multi-tenancy in the future, add RLS policies here.
