

# InvestSahi — Implementation Plan

## 1. Design System & Global Setup
- Add custom colors (saffron, green, sand, stone, blue, amber) to Tailwind config
- Add Google Fonts (Mukta, Hind, Noto Sans Oriya) to index.html
- Update global CSS: sand background, stone text, Hind body font, Mukta headings

## 2. i18n Setup
- Install and configure react-i18next with localStorage persistence (`investsahi-lang`)
- Create empty translation files for English (`en`) and Odia (`or`)
- All UI text will use `t('section.key')` — no hardcoded strings

## 3. Routing
- Language-prefixed routes: `/en`, `/or`, `/en/services`, `/or/services`, etc.
- Root `/` redirects to `/en`
- Route changes automatically sync i18n language
- Placeholder page components: Home, Services, Calculator, Learn, Book
- `/admin` route for admin panel

## 4. Supabase Database
Create 4 tables with RLS:
- **bookings** — name, email, phone, service interest, income range, status, etc. (public insert only)
- **newsletter_subscribers** — email, name, language pref (public insert only)
- **calculator_leads** — child age, target institution, SIP amounts, contact info (public insert only)
- **content_items** — bilingual content with type, slug, status (public select for published items)
- All tables: full access for authenticated (admin) users

## 5. Admin Panel (`/admin`)
Full admin UI with dark sidebar navigation and 6 sections:

- **Dashboard** — 4 stat cards (bookings, subscribers, leads, content counts) + recent bookings & subscribers tables
- **Bookings** — Filterable/searchable table with status pills, status change actions, pagination
- **Subscribers** — Searchable table with CSV export, pagination
- **Content** — Filterable table with slide-over editor panel for bilingual content (English + Odia side-by-side), create/edit/publish/delete
- **Calculator Leads** — Sortable table with pagination
- **Settings** — Placeholder form fields (WhatsApp, address, registration numbers) saved to localStorage

