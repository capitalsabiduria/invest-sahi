
-- bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_interest TEXT[],
  monthly_income_range TEXT,
  message TEXT,
  preferred_contact TEXT DEFAULT 'whatsapp',
  preferred_language TEXT DEFAULT 'en',
  source TEXT DEFAULT 'investsahi',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add check constraint for status
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('pending','confirmed','completed','cancelled'));

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Public insert
CREATE POLICY "Allow public insert on bookings"
  ON public.bookings FOR INSERT
  TO anon WITH CHECK (true);

-- Authenticated full access
CREATE POLICY "Allow authenticated full access on bookings"
  ON public.bookings FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- newsletter_subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  language_preference TEXT DEFAULT 'en',
  source TEXT DEFAULT 'investsahi',
  subscribed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on newsletter_subscribers"
  ON public.newsletter_subscribers FOR INSERT
  TO anon WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on newsletter_subscribers"
  ON public.newsletter_subscribers FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- calculator_leads table
CREATE TABLE public.calculator_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_age INTEGER,
  target_institution TEXT,
  monthly_sip_needed NUMERIC,
  user_monthly_budget NUMERIC,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.calculator_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on calculator_leads"
  ON public.calculator_leads FOR INSERT
  TO anon WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on calculator_leads"
  ON public.calculator_leads FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- content_items table
CREATE TABLE public.content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT,
  title_or TEXT,
  body_en TEXT,
  body_or TEXT,
  category TEXT,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.content_items ADD CONSTRAINT content_items_type_check
  CHECK (type IN ('story','glossary','guide','whatsapp_post'));

ALTER TABLE public.content_items ADD CONSTRAINT content_items_status_check
  CHECK (status IN ('draft','published'));

ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on published content_items"
  ON public.content_items FOR SELECT
  TO anon USING (status = 'published');

CREATE POLICY "Allow authenticated full access on content_items"
  ON public.content_items FOR ALL
  TO authenticated USING (true) WITH CHECK (true);
