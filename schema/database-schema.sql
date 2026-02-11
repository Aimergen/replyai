-- ============================================
-- AUTOREPLY.MN - DATABASE SCHEMA
-- ============================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  subscription_plan TEXT DEFAULT 'free', -- free, starter, pro, business
  subscription_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================

-- 2. USER_FACEBOOK_PAGES TABLE
CREATE TABLE IF NOT EXISTS user_facebook_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id TEXT NOT NULL,
  page_name TEXT NOT NULL,
  access_token TEXT NOT NULL, -- Long-lived Page Access Token
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  token_expires_at TIMESTAMPTZ,
  last_sync_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, page_id)
);

-- Enable RLS
ALTER TABLE user_facebook_pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own pages"
  ON user_facebook_pages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pages"
  ON user_facebook_pages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pages"
  ON user_facebook_pages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pages"
  ON user_facebook_pages FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_user_facebook_pages_user_id ON user_facebook_pages(user_id);
CREATE INDEX idx_user_facebook_pages_page_id ON user_facebook_pages(page_id);

-- ============================================

-- 3. REPLY_RULES TABLE
CREATE TABLE IF NOT EXISTS reply_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id TEXT, -- NULL бол бүх page-д
  keyword TEXT NOT NULL,
  reply_text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reply_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own rules"
  ON reply_rules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rules"
  ON reply_rules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rules"
  ON reply_rules FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rules"
  ON reply_rules FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_reply_rules_user_id ON reply_rules(user_id);
CREATE INDEX idx_reply_rules_keyword ON reply_rules(keyword);
CREATE INDEX idx_reply_rules_is_active ON reply_rules(is_active);

-- ============================================

-- 4. REPLY_LOGS TABLE
CREATE TABLE IF NOT EXISTS reply_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  comment_id TEXT NOT NULL,
  rule_id UUID REFERENCES reply_rules(id) ON DELETE SET NULL,
  original_comment TEXT NOT NULL,
  reply_sent TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reply_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own logs"
  ON reply_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_reply_logs_user_id ON reply_logs(user_id);
CREATE INDEX idx_reply_logs_page_id ON reply_logs(page_id);
CREATE INDEX idx_reply_logs_created_at ON reply_logs(created_at DESC);
CREATE INDEX idx_reply_logs_rule_id ON reply_logs(rule_id);

-- ============================================

-- 5. FUNCTIONS & TRIGGERS

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_facebook_pages_updated_at
  BEFORE UPDATE ON user_facebook_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reply_rules_updated_at
  BEFORE UPDATE ON reply_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================

-- 6. RPC FUNCTIONS

-- Increment rule usage count (atomic operation to avoid race conditions)
CREATE OR REPLACE FUNCTION increment_rule_usage(rule_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE reply_rules
  SET 
    usage_count = COALESCE(usage_count, 0) + 1,
    last_used_at = NOW()
  WHERE id = rule_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_rule_usage(UUID) TO authenticated;

-- ============================================

-- 7. SAMPLE DATA (optional, for testing)

-- Sample reply rules (эдгээрийг ашиглаж болно)
INSERT INTO reply_rules (user_id, keyword, reply_text, is_active) VALUES
  ('00000000-0000-0000-0000-000000000000', 'үнэ', 'Сайн байна уу! Үнийн мэдээллийг inbox руу илгээлээ. Баярлалаа! 😊', true),
  ('00000000-0000-0000-0000-000000000000', 'байгаа', 'Тийм ээ, бэлэн байна! Захиалга өгөхийг хүсвэл inbox-д бичнэ үү 📦', true),
  ('00000000-0000-0000-0000-000000000000', 'хүргэлт', 'Хүргэлт УБ хотод 24 цагийн дотор, хөдөө орон нутагт 3-5 хоногт хүргэнэ. Хүргэлтийн төлбөр 5,000₮', true)
ON CONFLICT DO NOTHING;

-- ============================================

COMMENT ON TABLE profiles IS 'User profile information';
COMMENT ON TABLE user_facebook_pages IS 'Connected Facebook Pages with access tokens';
COMMENT ON TABLE reply_rules IS 'Auto-reply rules based on keywords';
COMMENT ON TABLE reply_logs IS 'Log of all automatic replies sent';


-- СҮҮЛД НЭМЭГДСЭН ТАБЛУУД ---
-- Facebook Pages table
CREATE TABLE facebook_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id TEXT NOT NULL,
  page_name TEXT NOT NULL,
  access_token TEXT NOT NULL,
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  followers_count INTEGER DEFAULT 0,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_sync_at TIMESTAMPTZ,
  UNIQUE(user_id, page_id)
);

-- Reply Rules table
CREATE TABLE reply_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id UUID REFERENCES facebook_pages(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  reply_text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reply Logs table
CREATE TABLE reply_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id UUID REFERENCES facebook_pages(id) ON DELETE CASCADE,
  rule_id UUID REFERENCES reply_rules(id) ON DELETE SET NULL,
  comment_id TEXT NOT NULL,
  comment_text TEXT,
  reply_sent TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  subscription_plan TEXT DEFAULT 'free',
  subscription_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
