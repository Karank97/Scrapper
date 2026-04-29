create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  first_name text,last_name text,company_name text,
  property_address text not null, property_city text, property_state text default 'NJ', property_zip text,
  mailing_address text, mailing_city text, mailing_state text, mailing_zip text,
  phone text,email text,lead_type text not null,property_type text,owner_type text,
  source_name text not null, source_url text, source_category text,
  motivation_score int default 0, motivation_reason text,
  dnc_status text not null default 'unknown' check (dnc_status in ('unknown','needs_review','clear','do_not_contact')),
  contact_status text default 'new', assigned_agent text, notes text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists properties (
  id uuid primary key default gen_random_uuid(), lead_id uuid references leads(id) on delete cascade,
  address text, city text, county text, state text, zip text, property_type text,
  bedrooms numeric, bathrooms numeric, units int,
  estimated_value numeric, last_sale_date date, last_sale_price numeric, tax_assessment numeric,
  owner_occupied boolean, absentee_owner boolean, llc_owned boolean,
  created_at timestamptz default now()
);
create table if not exists do_not_contact (
  id uuid primary key default gen_random_uuid(), name text, phone text, email text, address text, reason text, created_at timestamptz default now()
);
create table if not exists outreach_queue (
  id uuid primary key default gen_random_uuid(), lead_id uuid references leads(id) on delete cascade,
  channel text, message text, status text default 'pending_manual_approval', approved_by_user boolean default false,
  follow_up_date date, last_contacted_at timestamptz, created_at timestamptz default now()
);
create table if not exists source_reviews (
  id uuid primary key default gen_random_uuid(), source_name text, source_url text, allowed_use_notes text, is_approved boolean default false, created_at timestamptz default now()
);
