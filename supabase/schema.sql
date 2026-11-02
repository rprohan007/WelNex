-- ==============================================================================
-- WelNex Platform - Supabase PostgreSQL Database Schema & RLS Policies
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLE: investments
-- Stores discovery catalogue listings, yields, risk, access models, custom fields & gallery
-- ==============================================================================
CREATE TABLE IF NOT EXISTS investments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT,
  symbol_ticker TEXT,                        -- NSE/BSE ticker symbol (e.g., 'EMBASSY', 'INDIGRID', 'GOLDBEES')
  price_mode TEXT NOT NULL DEFAULT 'LIVE_MARKET', -- 'LIVE_MARKET' vs 'PERIODIC_NAV'
  current_price NUMERIC(12, 2) NOT NULL DEFAULT 0, -- Real-time / NAV price in ₹
  price_change_24h NUMERIC(10, 2) NOT NULL DEFAULT 0, -- Shift in ₹
  price_change_percent_24h NUMERIC(6, 2) NOT NULL DEFAULT 0, -- Shift in %
  last_price_update TIMESTAMPTZ NOT NULL DEFAULT now(),
  yield_payout_frequency TEXT DEFAULT 'Quarterly', -- 'Quarterly', 'Monthly', 'Annual', 'Maturity'
  day_high NUMERIC(12, 2),
  day_low NUMERIC(12, 2),
  last_valuation_period TEXT,                -- e.g., 'Q3 2026' for unlisted assets
  sponsor TEXT NOT NULL DEFAULT 'Institutional Sponsor',
  priority_tier TEXT NOT NULL DEFAULT 'Priority 1',
  category TEXT NOT NULL,
  sub_category TEXT,
  access_model TEXT NOT NULL DEFAULT 'Direct Public',
  partner_name TEXT,
  sebi_regulated BOOLEAN NOT NULL DEFAULT true,
  regulatory_badge TEXT,
  regulatory_body TEXT DEFAULT 'SEBI',
  indicative_yield TEXT NOT NULL,
  yield_type TEXT DEFAULT 'Pre-Tax Indicative Distribution',
  min_investment TEXT NOT NULL,
  min_investment_numeric BIGINT NOT NULL DEFAULT 1000,
  tenure TEXT,
  lock_in_period TEXT,
  risk_level TEXT NOT NULL DEFAULT 'Moderate',
  distribution_frequency TEXT DEFAULT 'Quarterly',
  portfolio_scale TEXT DEFAULT 'Institutional Grade',
  occupancy TEXT,
  tagline TEXT,
  overview TEXT,
  strategy TEXT,
  underlying_assets JSONB DEFAULT '[]'::jsonb,
  sponsor_profile JSONB DEFAULT '{}'::jsonb,
  risk_factors JSONB DEFAULT '[]'::jsonb,
  liquidity_profile TEXT,
  fee_structure JSONB DEFAULT '{}'::jsonb,
  tax_implications TEXT,
  official_links JSONB DEFAULT '{}'::jsonb,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '[]'::jsonb,    -- Custom metadata fields (JSONB)
  gallery_images TEXT[] DEFAULT '{}',        -- Property image URLs
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Idempotent schema migration helpers for existing deployments
ALTER TABLE investments ADD COLUMN IF NOT EXISTS symbol_ticker TEXT;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS price_mode TEXT DEFAULT 'LIVE_MARKET';
ALTER TABLE investments ADD COLUMN IF NOT EXISTS current_price NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS price_change_24h NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS price_change_percent_24h NUMERIC(6, 2) DEFAULT 0;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS last_price_update TIMESTAMPTZ DEFAULT now();
ALTER TABLE investments ADD COLUMN IF NOT EXISTS yield_payout_frequency TEXT DEFAULT 'Quarterly';
ALTER TABLE investments ADD COLUMN IF NOT EXISTS day_high NUMERIC(12, 2);
ALTER TABLE investments ADD COLUMN IF NOT EXISTS day_low NUMERIC(12, 2);
ALTER TABLE investments ADD COLUMN IF NOT EXISTS last_valuation_period TEXT;

-- ==============================================================================
-- 3. TABLE: academy_topics
-- Stores top-level curriculum categories and course topics
-- ==============================================================================
CREATE TABLE IF NOT EXISTS academy_topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  icon_name TEXT DEFAULT 'BookOpen',
  sort_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 4. TABLE: academy_chapters
-- Stores hierarchical course modules with reading duration, difficulty tags & PDF/PPT attachments
-- ==============================================================================
CREATE TABLE IF NOT EXISTS academy_chapters (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL REFERENCES academy_topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Beginner',           -- Difficulty tags (Beginner | Intermediate | Advanced)
  estimated_reading_time TEXT DEFAULT '8 min read',      -- Reading duration label
  duration_minutes INTEGER NOT NULL DEFAULT 8,          -- Reading duration numeric
  summary TEXT,
  sort_order INTEGER NOT NULL DEFAULT 1,
  content_sections JSONB DEFAULT '[]'::jsonb,
  numerical_examples JSONB DEFAULT '[]'::jsonb,
  quiz_questions JSONB DEFAULT '[]'::jsonb,
  resources JSONB DEFAULT '[]'::jsonb,                  -- PDF/PPT/PPTX file URL attachments
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 5. TABLE: waitlist
-- Stores early access signups with investor profile and timestamp
-- ==============================================================================
CREATE TABLE IF NOT EXISTS waitlist (
  id TEXT PRIMARY KEY DEFAULT ('lead-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 4)),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  investor_profile TEXT DEFAULT 'Curious Beginner',
  interests TEXT[] DEFAULT '{}',
  signup_date TEXT DEFAULT to_char(current_date, 'YYYY-MM-DD'),
  status TEXT NOT NULL DEFAULT 'Verified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 6. TABLE: contact_inquiries
-- Stores customer and institutional contact requests with status workflow
-- ==============================================================================
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id TEXT PRIMARY KEY DEFAULT ('inq-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 4)),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  category TEXT DEFAULT 'General Inquiry',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Unread',  -- 'Unread' | 'Contacted' | 'Resolved'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 7. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_investments_category ON investments(category);
CREATE INDEX IF NOT EXISTS idx_investments_risk ON investments(risk_level);
CREATE INDEX IF NOT EXISTS idx_investments_priority ON investments(priority_tier);
CREATE INDEX IF NOT EXISTS idx_academy_chapters_topic ON academy_chapters(topic_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(lower(email));
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Enable RLS on all tables
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running script
DROP POLICY IF EXISTS "Public read investments" ON investments;
DROP POLICY IF EXISTS "Public upsert investments" ON investments;
DROP POLICY IF EXISTS "Public delete investments" ON investments;

DROP POLICY IF EXISTS "Public read academy_topics" ON academy_topics;
DROP POLICY IF EXISTS "Public upsert academy_topics" ON academy_topics;
DROP POLICY IF EXISTS "Public delete academy_topics" ON academy_topics;

DROP POLICY IF EXISTS "Public read academy_chapters" ON academy_chapters;
DROP POLICY IF EXISTS "Public upsert academy_chapters" ON academy_chapters;
DROP POLICY IF EXISTS "Public delete academy_chapters" ON academy_chapters;

DROP POLICY IF EXISTS "Public insert waitlist" ON waitlist;
DROP POLICY IF EXISTS "Admin read waitlist" ON waitlist;
DROP POLICY IF EXISTS "Admin update waitlist" ON waitlist;
DROP POLICY IF EXISTS "Admin delete waitlist" ON waitlist;

DROP POLICY IF EXISTS "Public insert contact_inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Admin read contact_inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Admin update contact_inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Admin delete contact_inquiries" ON contact_inquiries;

-- A. Investments: Public read access; authorized client write access for Admin CMS
CREATE POLICY "Public read investments" ON investments
  FOR SELECT USING (true);

CREATE POLICY "Public upsert investments" ON investments
  FOR ALL USING (true) WITH CHECK (true);

-- B. Academy Topics & Chapters: Public read access; authorized client write access for Admin CMS
CREATE POLICY "Public read academy_topics" ON academy_topics
  FOR SELECT USING (true);

CREATE POLICY "Public upsert academy_topics" ON academy_topics
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read academy_chapters" ON academy_chapters
  FOR SELECT USING (true);

CREATE POLICY "Public upsert academy_chapters" ON academy_chapters
  FOR ALL USING (true) WITH CHECK (true);

-- C. Waitlist: Protected public insert for lead captures; read/update/delete for Admin CMS
CREATE POLICY "Public insert waitlist" ON waitlist
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin read waitlist" ON waitlist
  FOR SELECT USING (true);

CREATE POLICY "Admin update waitlist" ON waitlist
  FOR UPDATE USING (true);

CREATE POLICY "Admin delete waitlist" ON waitlist
  FOR DELETE USING (true);

-- D. Contact Inquiries: Protected public insert for inquiries; read/update/delete for Admin CMS
CREATE POLICY "Public insert contact_inquiries" ON contact_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin read contact_inquiries" ON contact_inquiries
  FOR SELECT USING (true);

CREATE POLICY "Admin update contact_inquiries" ON contact_inquiries
  FOR UPDATE USING (true);

CREATE POLICY "Admin delete contact_inquiries" ON contact_inquiries
  FOR DELETE USING (true);

-- ==============================================================================
-- 9. INITIAL SEED DATA
-- ==============================================================================

-- A. Initial Waitlist Leads
INSERT INTO waitlist (id, full_name, email, investor_profile, interests, signup_date, status)
VALUES
  ('lead-001', 'Rohan Sharma', 'rprohan06@gmail.com', 'HNW / Accredited Investor', ARRAY['REIT', 'InvIT', 'SDI'], '2026-10-24', 'VIP Invited'),
  ('lead-002', 'Meera Nambiar', 'meera.nambiar@heritage-wealth.in', 'Retail Stock/MF Investor', ARRAY['REIT', 'Bond'], '2026-10-23', 'Verified'),
  ('lead-003', 'Arvind Singhal', 'arvind.singhal@singhalcapital.com', 'Institutional / Family Office', ARRAY['InvIT', 'SDI', 'Gold'], '2026-10-22', 'VIP Invited'),
  ('lead-004', 'Dr. Sanjay Gupta', 'sanjay.gupta.md@globalcare.org', 'NRI Investor', ARRAY['REIT', 'Gold', 'Bond'], '2026-10-21', 'Verified'),
  ('lead-005', 'Vikramaditya Iyer', 'vikram.iyer@ca-associates.in', 'Finance Professional / CA', ARRAY['SDI', 'Bond', 'InvIT'], '2026-10-20', 'Pending Review')
ON CONFLICT (id) DO NOTHING;

-- B. Initial Contact Inquiries
INSERT INTO contact_inquiries (id, full_name, email, phone, category, message, status)
VALUES
  ('inq-101', 'Vikramaditya Singhania', 'v.singhania@apexcapital.in', '+91 98201 44521', 'Family Office / Institutional', 'We are evaluating SEBI-registered Category II AIFs and SM REIT pipelines for our multi-family office in Mumbai. Would like to understand WelNex verification criteria and institutional API access.', 'Unread'),
  ('inq-102', 'Dr. Ananya Deshmukh', 'ananya.deshmukh@cardiohealth.org', '+91 94220 88390', 'Retail & HNI Investor', 'Hello team WelNex. I currently invest in mutual funds and fixed deposits. Wanted guidance on whether InvIT distribution yields (like IndiGrid or PGInvIT) have TDS withheld automatically, and how taxation works in the 30% slab.', 'Contacted'),
  ('inq-103', 'Rajesh K. Mehta', 'rajesh.mehta@solargridinfra.com', '+91 98110 33402', 'Asset Sponsor / Listing', 'We are preparing a ₹250 Cr clean-energy InvIT prospectus for renewable solar assets in Gujarat & Rajasthan. We would like to explore listing asset disclosures on WelNex discovery catalogue.', 'Unread'),
  ('inq-104', 'Pooja Iyer', 'pooja.iyer@wealthzenith.com', '+91 97410 55199', 'Advisor Demo', 'Requesting a demo of the Virtual Portfolio Simulator for our team of 14 wealth managers in Bengaluru to stress-test high-yield corporate bonds.', 'Resolved')
ON CONFLICT (id) DO NOTHING;

-- C. Initial Academy Topics
INSERT INTO academy_topics (id, title, slug, category, description, icon_name, sort_order)
VALUES
  ('topic-foundations', 'Alternative Investment Foundations in India', 'alternative-investment-foundations', 'Foundations', 'Master the structural shift from traditional fixed deposits and equities into cash-flow-generating alternative assets under SEBI and RBI frameworks.', 'BookOpen', 1),
  ('topic-reits', 'Real Estate Investment Trusts (REITs)', 'reits-mastery', 'REITs', 'Learn how Indian listed commercial REITs generate contractual quarterly dividends with capital appreciation.', 'Building2', 2),
  ('topic-sm-reits', 'Small and Medium REITs (SM REITs)', 'sm-reits-framework', 'SM REITs', 'Understand the revolutionary 2024 SEBI SM REIT framework opening ₹50 Cr+ institutional assets.', 'Layers', 3),
  ('topic-invits', 'Infrastructure Investment Trusts (InvITs)', 'invits-mastery', 'InvITs', 'Explore power transmission, solar grids, and toll highways delivering stable, inflation-linked yields.', 'TowerControl', 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  description = EXCLUDED.description;

-- D. Initial Academy Chapters (with reading duration, difficulty tags & attachments)
INSERT INTO academy_chapters (id, topic_id, title, slug, difficulty, estimated_reading_time, duration_minutes, summary, sort_order, content_sections, resources)
VALUES
  (
    'lesson-foundations-01',
    'topic-foundations',
    'Demystifying Alternative Assets: Beyond Equities & Fixed Deposits',
    'demystifying-alternative-assets',
    'Beginner',
    '6 min read',
    6,
    'Understand why institutional family offices allocate 20-30% of portfolios to alternatives and how retail participation is evolving.',
    1,
    '[{"id":"sec-1","heading":"The Evolution of Indian Wealth Allocation","paragraphs":["For decades, Indian household savings were concentrated in residential real estate, physical gold, and bank fixed deposits. However, fixed deposits often yield negative real returns after adjusting for retail inflation and personal tax brackets.","Alternative investments encompass asset classes outside traditional listed equities, government debt, and liquid savings. In India, institutional alternative assets generate contractual cash distributions backed by physical infrastructure, commercial leases, or securitized corporate receivables."]}]'::jsonb,
    '[{"id":"res-foundations-deck","title":"WelNex Alternative Asset Master Class Slides","fileType":"pdf","fileUrl":"https://assets.welnex.in/curriculum/welnex-alternatives-foundations.pdf","fileSize":"2.4 MB","description":"Official institutional orientation deck covering Indian alternatives landscape."}]'::jsonb
  ),
  (
    'lesson-reits-01',
    'topic-reits',
    'Commercial REIT Mechanics: Rent Collections, Occupancy & 90% NDCF Rule',
    'commercial-reit-mechanics',
    'Beginner',
    '8 min read',
    8,
    'A deep dive into how Grade-A office parks collect rent from multinational tenants and distribute 90% of cash flows quarterly.',
    1,
    '[{"id":"sec-1","heading":"Contractual Rent Cascades","paragraphs":["Indian REITs are mandated by SEBI to invest at least 80% of value in completed, revenue-generating commercial properties.","SEBI NDCF rules mandate that at least 90% of Net Distributable Cash Flows must be passed through directly to unitholders on at least a half-yearly or quarterly cadence."]}]'::jsonb,
    '[{"id":"res-reit-guide","title":"SEBI REIT Regulations 2014 Investor Handbook","fileType":"pdf","fileUrl":"https://assets.welnex.in/curriculum/sebi-reits-investor-guide.pdf","fileSize":"1.8 MB","description":"Official regulatory summary of unitholder rights and governance."}]'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  estimated_reading_time = EXCLUDED.estimated_reading_time,
  duration_minutes = EXCLUDED.duration_minutes,
  resources = EXCLUDED.resources;
